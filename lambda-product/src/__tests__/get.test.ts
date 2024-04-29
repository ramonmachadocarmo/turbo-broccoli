import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetAll, GetById } from '../index';
import { expect, describe, it } from '@jest/globals';
import updateErr2Event from '../../events/updateErr2.json';
import getByIdErrEvent from '../../events/getByIdErr.json';
import getByIdEvent from '../../events/getById.json';

describe('Product get tests', () => {
    it('Should return product list json', async () => {
        const result: APIGatewayProxyResult = await GetAll();
        const body = JSON.parse(result.body);
        const count = body.products.length;

        expect(result.statusCode).toEqual(200);
        expect(count).toBeGreaterThan(0);
    });
});

describe('Product get by id tests', () => {
    it('Should return error required id', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(updateErr2Event));

        const result: APIGatewayProxyResult = await GetById(event);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(400);
        expect(body.message).toEqual('Required ID');
    });
    it('Should return product json', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(getByIdEvent));

        const result: APIGatewayProxyResult = await GetById(event);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(200);
        expect(body.product.code).toEqual('PRD001');
    });
    it('Should return error product not found', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(getByIdErrEvent));

        const result: APIGatewayProxyResult = await GetById(event);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(500);
        expect(body.message).toEqual('Product not found');
    });
});
