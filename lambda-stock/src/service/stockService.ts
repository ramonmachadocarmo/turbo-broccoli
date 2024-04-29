import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import Stock from '../model/Stock';

export default class StockService {
    private Tablename = 'stockTB';

    constructor(private docClient: DocumentClient) {}

    async getAll(): Promise<Stock[]> {
        const stocks = await this.docClient
            .scan({
                TableName: this.Tablename,
            })
            .promise();
        return stocks.Items as Stock[];
    }
    async getPendingAddress(): Promise<Stock[]> {
        const stocks = await this.getAll();
        return stocks.filter((stock) => stock.warehouse === null);
    }
    async getByWarehouse(warehouse: string): Promise<Stock> {
        const stock = await this.docClient
            .scan({
                TableName: this.Tablename,
                FilterExpression: 'warehouse = :warehouse',
                ExpressionAttributeValues: { ':warehouse': warehouse },
            })
            .promise();

        if (!stock.Items || stock.Items.length === 0) throw new Error('Stock not found');
        return stock.Items[0] as Stock;
    }
    async getByStockAndProduct(stock: string, product: string): Promise<Stock> {
        const stocks = await this.docClient
            .scan({
                TableName: this.Tablename,
                FilterExpression: 'warehouse = :warehouse, product = :product',
                ExpressionAttributeValues: { ':warehouse': stock, ':product': product },
            })
            .promise();

        if (!stocks.Items || stocks.Items.length === 0) throw new Error('Stock not found');
        return stocks.Items[0] as Stock;
    }

    async create(stock: Stock): Promise<Stock> {
        await this.docClient
            .put({
                TableName: this.Tablename,
                Item: stock,
            })
            .promise();
        return stock as Stock;
    }

    async delete(id: string): Promise<unknown> {
        const stock = await this.getByWarehouse(id);
        if (!stock || stock.warehouse != id) throw new Error('Stock not found');

        return await this.docClient
            .delete({
                TableName: this.Tablename,
                Key: { id: stock.id },
            })
            .promise();
    }

    async updateQty(stock: Stock): Promise<Stock> {
        await this.docClient
            .update({
                TableName: this.Tablename,
                Key: { id: stock.id },
                UpdateExpression: 'set quantity = :quantity',
                ExpressionAttributeValues: { ':quantity': stock.quantity },
            })
            .promise();
        return stock;
    }
}
