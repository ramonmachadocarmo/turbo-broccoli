import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Create } from '../index';
import { expect, describe, it } from '@jest/globals';
import saveEvent from '../../events/save.json';

describe('Supplier save tests', () => {
    it('Should return supplier json', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(saveEvent));

        const result: APIGatewayProxyResult = await Create(event);
        const body = JSON.parse(result.body);
        const today = new Date().toISOString();

        expect(result.statusCode).toEqual(200);
        expect(body.supplier.cnpj).toEqual('1234567890');
        expect(body.supplier.createdAt.substring(0, 10)).toEqual(today.substring(0, 10));
    });
    it('Should return error supplier already exists', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(saveEvent));
        await Create(event);
        const result: APIGatewayProxyResult = await Create(event);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(500);
        expect(body.message).toEqual('Supplier already exists');
        expect(body.body).not.toEqual('Invalid code');
    });
});
