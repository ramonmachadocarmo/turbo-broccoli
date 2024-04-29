import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import supplierService from '../../service';
import { v4 } from 'uuid';

export const get = async (): Promise<APIGatewayProxyResult> => {
    try {
        const suppliers = await supplierService.getAll();
        return {
            statusCode: 200,
            body: JSON.stringify({
                suppliers: suppliers,
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
        const { cnpj, name, fantasyName } = JSON.parse(event.body || '{}');
        const supplier = await supplierService.create({
            id,
            cnpj,
            name,
            fantasyName,
            createdAt: date,
            updatedAt: undefined,
        });
        return {
            statusCode: 200,
            body: JSON.stringify({ supplier }),
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
        const supplier = await supplierService.getById(id);
        return {
            statusCode: 200,
            body: JSON.stringify({ supplier }),
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
        const { cnpj, name, fantasyName } = JSON.parse(event.body || '{}');
        const date = new Date();
        const supplier = await supplierService.update({
            id,
            cnpj,
            name,
            fantasyName,
            createdAt: date,
            updatedAt: date,
        });
        return {
            statusCode: 200,
            body: JSON.stringify({ supplier }),
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
        const supplier = await supplierService.delete(id);
        return {
            statusCode: 200,
            body: JSON.stringify({ supplier }),
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
