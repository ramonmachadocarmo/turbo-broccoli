import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import Product from '../model/Product';

const regex = /[a-zA-z]{3}\d{6}$/;
const regex2 = /^([a-zA-Z]{3})(.*)$/;

function codeValidator(code: string): boolean {
    return regex.test(code);
}
function incrementDigit(input: string): string {
    const match = input.match(regex2);
    if (match && match.length > 2) {
        const code = match && match.length > 2 ? match[2] : '0';
        let digit = parseInt(code);
        ++digit;
        return match[1] + padLeft(digit, 6);
    }
    return '';
}
function padLeft(num: number, length: number): string {
    let str = num.toString(); // Convert the number to a string
    while (str.length < length) {
        str = '0' + str; // Add leading zeros until it reaches the desired length
    }
    return str;
}

export default class ProductService {
    private Tablename = 'productTB';

    constructor(private docClient: DocumentClient) {}

    async getAll(): Promise<Product[]> {
        const products = await this.docClient
            .scan({
                TableName: this.Tablename,
            })
            .promise();
        return products.Items as Product[];
    }
    async getById(id: string): Promise<Product> {
        const product = await this.docClient
            .scan({
                TableName: this.Tablename,
                FilterExpression: 'code = :code',
                ExpressionAttributeValues: { ':code': id },
            })
            .promise();

        if (!product.Items || product.Items.length === 0) throw new Error('Product not found');
        return product.Items[0] as Product;
    }
    async productExists(code: string): Promise<boolean> {
        try {
            await this.getById(code);
            return true;
        } catch (error) {
            return false;
        }
    }

    async create(product: Product): Promise<Product> {
        if (!codeValidator(product.code)) {
            throw new Error('Invalid code');
        }
        const productExists = await this.productExists(product.code);
        if (productExists) {
            throw new Error('Product already exists');
        }
        await this.docClient
            .put({
                TableName: this.Tablename,
                Item: product,
            })
            .promise();
        return product as Product;
    }
    async update(product: Product): Promise<Product> {
        try {
            const prod = await this.getById(product.code);

            const updated = await this.docClient
                .update({
                    TableName: this.Tablename,
                    Key: { id: prod.id },
                    UpdateExpression:
                        'set #stockMin = :stockMin, #stockMax = :stockMax, #stockCurrent = :stockCurrent, #pricePurchase = :pricePurchase, #priceSale = :priceSale',
                    ExpressionAttributeNames: {
                        '#stockMin': 'stockMin',
                        '#stockMax': 'stockMax',
                        '#stockCurrent': 'stockCurrent',
                        '#pricePurchase': 'pricePurchase',
                        '#priceSale': 'priceSale',
                    },
                    ExpressionAttributeValues: {
                        ':stockMin': product.stockMin,
                        ':stockMax': product.stockMax,
                        ':stockCurrent': product.stockCurrent,
                        ':pricePurchase': product.pricePurchase,
                        ':priceSale': product.priceSale,
                    },
                    ReturnValues: 'ALL_NEW',
                })
                .promise();
            return updated.Attributes as Product;
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            throw new Error(message);
        }
    }
    async delete(id: string): Promise<unknown> {
        const product = await this.getById(id);
        if (!product || product.code != id) throw new Error('Product not found');

        return await this.docClient
            .delete({
                TableName: this.Tablename,
                Key: { id: product.id },
            })
            .promise();
    }

    async getNextCode(category: string): Promise<string> {
        const list = await this.docClient
            .scan({
                TableName: this.Tablename,
                FilterExpression: 'category = :category',
                ExpressionAttributeValues: { ':category': category },
            })
            .promise();

        if (list.Items && list.Items.length > 0) {
            const last = list.Items.reduce((last, current) => {
                return last.code > current.code ? last : current;
            });
            return incrementDigit(last.code);
        }
        return `${category}000001`;
    }
}
