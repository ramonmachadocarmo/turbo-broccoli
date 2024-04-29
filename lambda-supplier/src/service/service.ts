import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import Supplier from '../model/Supplier';

export default class SupplierService {
    private Tablename = 'supplierTB';

    constructor(private docClient: DocumentClient) {}

    async getAll(): Promise<Supplier[]> {
        const suppliers = await this.docClient
            .scan({
                TableName: this.Tablename,
            })
            .promise();
        return suppliers.Items as Supplier[];
    }
    async getById(id: string): Promise<Supplier> {
        const supplier = await this.docClient
            .scan({
                TableName: this.Tablename,
                FilterExpression: 'cnpj = :cnpj',
                ExpressionAttributeValues: { ':cnpj': id },
            })
            .promise();

        if (!supplier.Items || supplier.Items.length === 0) throw new Error('Supplier not found');
        return supplier.Items[0] as Supplier;
    }
    async supplierExists(code: string): Promise<boolean> {
        try {
            await this.getById(code);
            return true;
        } catch (error) {
            return false;
        }
    }

    async create(supplier: Supplier): Promise<Supplier> {
        const supplierExists = await this.supplierExists(supplier.cnpj);
        if (supplierExists) {
            throw new Error('Supplier already exists');
        }
        await this.docClient
            .put({
                TableName: this.Tablename,
                Item: supplier,
            })
            .promise();
        return supplier as Supplier;
    }
    async update(supplier: Supplier): Promise<Supplier> {
        try {
            const sup = await this.getById(supplier.cnpj);

            const updated = await this.docClient
                .update({
                    TableName: this.Tablename,
                    Key: { id: sup.id },
                    UpdateExpression: 'set #name = :name, #fantasyName = :fantasyName',
                    ExpressionAttributeNames: {
                        '#name': 'name',
                        '#fantasyName': 'fantasyName',
                    },
                    ExpressionAttributeValues: {
                        ':name': supplier.name,
                        ':fantasyName': supplier.fantasyName,
                    },
                    ReturnValues: 'ALL_NEW',
                })
                .promise();
            return updated.Attributes as Supplier;
        } catch (e) {
            throw new Error('Supplier not found');
        }
    }
    async delete(id: string): Promise<unknown> {
        const supplier = await this.getById(id);
        if (!supplier || supplier.cnpj != id) throw new Error('Supplier not found');

        return await this.docClient
            .delete({
                TableName: this.Tablename,
                Key: { id: supplier.id },
            })
            .promise();
    }
}
