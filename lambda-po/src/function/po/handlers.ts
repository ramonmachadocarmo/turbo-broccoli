import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import poService from '../../service';
import { v4 } from 'uuid';
import IPOItem from '../../model/POItem';

export const get = async (): Promise<APIGatewayProxyResult> => {
    try {
        const pos = await poService.getAll();
        return {
            statusCode: 200,
            body: JSON.stringify({
                pos: pos,
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
        const { numberPO, supplier, purchaseDate, value, discount, status, paymentCondition, items } = JSON.parse(
            event.body || '{}',
        );

        const po = await poService.create({
            id,
            numberPO,
            supplier,
            purchaseDate,
            value,
            discount,
            status,
            paymentCondition,
            items,
            createdAt: date,
            updatedAt: undefined,
        });
        return {
            statusCode: 200,
            body: JSON.stringify({ po }),
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

export const getById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters?.id;
    if (!id)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Required ID' }),
        };
    try {
        const po = await poService.getById(id);
        return {
            statusCode: 200,
            body: JSON.stringify({ po }),
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
        const date = new Date();
        const { numberPO, supplier, purchaseDate, status, paymentCondition, items } = JSON.parse(event.body || '{}');
        const value = items.reduce((acc: number, b: IPOItem) => {
            return acc + b.price * b.quantity;
        }, 0);
        const discount = items.reduce((acc: number, b: IPOItem) => {
            return acc + b.discount;
        }, 0);
        const po = await poService.update({
            id,
            numberPO,
            supplier,
            purchaseDate,
            value,
            discount,
            status,
            paymentCondition,
            items,
            createdAt: date,
            updatedAt: date,
        });
        return {
            statusCode: 200,
            body: JSON.stringify({ po }),
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
export const deleteById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters?.id;
    if (!id)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Required ID' }),
        };
    try {
        const po = await poService.delete(id);
        return {
            statusCode: 200,
            body: JSON.stringify({ po }),
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

export const getNextCode = async (): Promise<APIGatewayProxyResult> => {
    try {
        const nextCode = await poService.getNextCode();
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

export async function confirmPO(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const number = event.pathParameters?.po;
        if (!number) {
            throw new Error('Required Number PO');
        }
        const { numberPO } = JSON.parse(event.body || '{}');
        if (numberPO !== number) {
            throw new Error('Number PO not match');
        }
        const result = await poService.confirmPO(numberPO);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: result }),
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
}
