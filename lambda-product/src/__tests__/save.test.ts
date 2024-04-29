import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Create } from '../index';
import { expect, describe, it } from '@jest/globals';
import saveEvent from '../../events/save.json';
import saveErrEvent from '../../events/saveErr.json';

describe('Product save tests', () => {
    it('Should return error invalid product code', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(saveErrEvent));

        const result: APIGatewayProxyResult = await Create(event);

        expect(result.statusCode).toEqual(500);
        expect(result.body).toEqual('{"message":"Invalid code"}');
    });
    it('Should return product json', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(saveEvent));

        const result: APIGatewayProxyResult = await Create(event);
        const body = JSON.parse(result.body);
        const today = new Date().toISOString();

        expect(result.statusCode).toEqual(200);
        expect(body.product.code).toEqual('PRD001');
        expect(body.product.createdAt.substring(0, 10)).toEqual(today.substring(0, 10));
    });
    it('Should return error product already exists', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(saveEvent));

        const result: APIGatewayProxyResult = await Create(event);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(500);
        expect(body.message).toEqual('Product already exists');
        expect(body.body).not.toEqual('Invalid code');
    });
});
