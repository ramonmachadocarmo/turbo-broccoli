import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import PO from '../model/PO';
import { sendToLambdaStock } from '../function/po/callstack';

function padLeft(num: number, length: number): string {
    let str = num.toString(); // Convert the number to a string
    while (str.length < length) {
        str = '0' + str; // Add leading zeros until it reaches the desired length
    }
    return str;
}

export default class POService {
    private Tablename = 'purchaseOrderTB';

    constructor(private docClient: DocumentClient) {}

    async getAll(): Promise<PO[]> {
        const po = await this.docClient
            .scan({
                TableName: this.Tablename,
            })
            .promise();
        return po.Items as PO[];
    }
    async getById(id: string): Promise<PO> {
        const po = await this.docClient
            .scan({
                TableName: this.Tablename,
                FilterExpression: 'numberPO = :numberPO',
                ExpressionAttributeValues: { ':numberPO': id },
            })
            .promise();

        if (!po.Items || po.Items.length === 0) throw new Error('Purchase order not found');
        return po.Items[0] as PO;
    }
    async poExists(code: string): Promise<boolean> {
        try {
            await this.getById(code);
            return true;
        } catch (error) {
            return false;
        }
    }

    async create(po: PO): Promise<PO> {
        const poExists = await this.poExists(po.numberPO);
        if (poExists) {
            throw new Error('Purchase order already exists');
        }

        await this.docClient
            .put({
                TableName: this.Tablename,
                Item: po,
            })
            .promise();
        return po as PO;
    }
    async update(po: PO): Promise<PO> {
        try {
            const purchase = await this.getById(po.numberPO);

            const updated = await this.docClient
                .update({
                    TableName: this.Tablename,
                    Key: { id: purchase.id },
                    UpdateExpression: 'set #purchaseDate = :purchaseDate, #status = :status, #items = :items',
                    ExpressionAttributeNames: {
                        '#purchaseDate': 'purchaseDate',
                        '#status': 'status',
                        '#items': 'items',
                    },
                    ExpressionAttributeValues: {
                        ':purchaseDate': po.purchaseDate,
                        ':status': po.status,
                        ':items': po.items,
                    },
                    ReturnValues: 'ALL_NEW',
                })
                .promise();
            return updated.Attributes as PO;
        } catch (e) {
            throw new Error('Purchase order not found');
        }
    }
    async delete(id: string): Promise<unknown> {
        const purchase = await this.getById(id);
        if (!purchase || purchase.numberPO != id) throw new Error('Purchase order not found');

        return await this.docClient
            .delete({
                TableName: this.Tablename,
                Key: { id: purchase.id },
            })
            .promise();
    }
    async getNextCode(): Promise<string> {
        const list = await this.docClient
            .scan({
                TableName: this.Tablename,
            })
            .promise();

        if (list.Items && list.Items.length > 0) {
            const last = list.Items.reduce((last, current) => {
                return last.numberPO > current.numberPO ? last : current;
            });
            let code = parseInt(last.numberPO);
            ++code;
            return padLeft(code, 10);
        }
        return `0000000001`;
    }
    async confirmPO(numberPO: string): Promise<PO> {
        const po = await this.getById(numberPO);
        if (!po) {
            throw new Error("Purchase order doesn't exists");
        }
        po.status = 'confirmed';

        sendToLambdaStock(po.items);
        return await this.update(po);
    }
}
