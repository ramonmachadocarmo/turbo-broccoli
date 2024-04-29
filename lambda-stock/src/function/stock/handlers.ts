import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 } from 'uuid';
import { stockService, movementService } from '../../service';

export const get = async (): Promise<APIGatewayProxyResult> => {
    try {
        const stocks = await stockService.getAll();
        return {
            statusCode: 200,
            body: JSON.stringify({
                stocks: stocks,
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
        const { warehouse, product, quantity, blocked, reserved } = JSON.parse(event.body || '{}');
        const stock = await stockService.create({
            id,
            warehouse,
            product,
            quantity,
            blocked,
            reserved,
            createdAt: date,
            updatedAt: undefined,
        });
        return {
            statusCode: 200,
            body: JSON.stringify({ stock }),
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

export const getStock = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters?.id;
    if (!id)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Required ID' }),
        };
    try {
        const stock = await stockService.getByWarehouse(id);
        return {
            statusCode: 200,
            body: JSON.stringify({ stock }),
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

export const getByStockAndProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const stock = event.pathParameters?.stock;
    const product = event.pathParameters?.product;
    if (!stock || !product) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Required stock and product' }),
        };
    }
    try {
        const stocks = await stockService.getByStockAndProduct(stock, product);
        return {
            statusCode: 200,
            body: JSON.stringify({ stocks }),
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

export const deleteStock = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters?.id;
    if (!id)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Required ID' }),
        };
    try {
        const stock = await stockService.delete(id);
        return {
            statusCode: 200,
            body: JSON.stringify({ stock }),
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
export const setMovement = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = v4();
        let { ...movement } = JSON.parse(event.body || '{}');
        movement.id = id;
        movement = await movementService.setMovement(movement);
        return {
            statusCode: 200,
            body: JSON.stringify({ movement }),
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
