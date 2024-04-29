import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Create } from '../index';
import { expect, describe, it } from '@jest/globals';
import saveEvent from '../../events/save.json';

describe('Purchase Order save tests', () => {
    it('Should return purchase Order json', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(saveEvent));

        const result: APIGatewayProxyResult = await Create(event);
        const body = JSON.parse(result.body);
        const today = new Date().toISOString();

        expect(result.statusCode).toEqual(200);
        expect(body.po.numberPO).toEqual('123');
        expect(body.po.createdAt.substring(0, 10)).toEqual(today.substring(0, 10));
    });
    it('Should return error purchase Order already exists', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(saveEvent));
        await Create(event);
        const result: APIGatewayProxyResult = await Create(event);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(500);
        expect(body.message).toEqual('Purchase order already exists');
        expect(body.body).not.toEqual('Invalid code');
    });
});
