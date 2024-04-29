import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import productService from '../../service';
import { v4 } from 'uuid';

export const get = async (): Promise<APIGatewayProxyResult> => {
    try {
        const products = await productService.getAll();
        return {
            statusCode: 200,
            body: JSON.stringify({
                products: products,
            }),
        };
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: e,
            }),
        };
    }
};

export const create = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = v4();
        const date = new Date();
        const {
            code,
            name,
            category,
            description,
            measureUnit,
            measureUnit2 = null,
            stockMin = null,
            stockMax = null,
            stockCurrent = null,
            pricePurchase = null,
            priceSale = null,
        } = JSON.parse(event.body || '{}');
        const product = await productService.create({
            id,
            code,
            name,
            category,
            description,
            measureUnit,
            measureUnit2,
            stockMin,
            stockMax,
            stockCurrent,
            pricePurchase,
            priceSale,
            createdAt: date,
            updatedAt: undefined,
        });
        return {
            statusCode: 200,
            body: JSON.stringify({ product }),
        };
    } catch (e) {
        const message = e instanceof Error ? e.message : e;
        return {
            statusCode: 500,
            body: JSON.stringify({
                message,
            }),
        };
    }
};

export const getProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters?.id;
    if (!id)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Required ID' }),
        };
    try {
        const product = await productService.getById(id);
        return {
            statusCode: 200,
            body: JSON.stringify({ product }),
        };
    } catch (e) {
        const message = e instanceof Error ? e.message : e;
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: message,
            }),
        };
    }
};

export const update = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters?.id;

    if (!id)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Required ID' }),
        };
    try {
        const {
            code,
            name,
            category,
            description,
            measureUnit,
            measureUnit2 = null,
            stockMin = null,
            stockMax = null,
            stockCurrent = null,
            pricePurchase = null,
            priceSale = null,
        } = JSON.parse(event.body || '{}');
        const date = new Date();
        const product = await productService.update({
            id,
            code,
            name,
            category,
            description,
            measureUnit,
            measureUnit2,
            stockMin,
            stockMax,
            stockCurrent,
            pricePurchase,
            priceSale,
            createdAt: date,
            updatedAt: date,
        });
        return {
            statusCode: 200,
            body: JSON.stringify({ product }),
        };
    } catch (e) {
        const message = e instanceof Error ? e.message : e;
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: message,
            }),
        };
    }
};
export const deleteProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters?.id;
    if (!id)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Required ID' }),
        };
    try {
        const product = await productService.delete(id);
        return {
            statusCode: 200,
            body: JSON.stringify({ product }),
        };
    } catch (e) {
        const message = e instanceof Error ? e.message : e;
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: message,
            }),
        };
    }
};

export const getNextCode = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const category = event.pathParameters?.category;
    if (!category) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Required category' }),
        };
    }
    try {
        const nextCode = await productService.getNextCode(category);
        return {
            statusCode: 200,
            body: JSON.stringify({ nextCode }),
        };
    } catch (e) {
        const message = e instanceof Error ? e.message : e;
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: message,
            }),
        };
    }
};
