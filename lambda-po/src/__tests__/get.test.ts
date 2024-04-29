import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetById, GetAll } from '../index';
import { expect, describe, it } from '@jest/globals';
import updateErr2Event from '../../events/updateErr2.json';
import getByIdErrEvent from '../../events/getByIdErr.json';
import getByIdEvent from '../../events/getById.json';

describe('Purchase order get tests', () => {
    it('Should return purchase order list json', async () => {
        const result: APIGatewayProxyResult = await GetAll();
        const body = JSON.parse(result.body);
        const count = body.pos.length;

        expect(result.statusCode).toEqual(200);
        expect(count).toBeGreaterThan(0);
    });
});

describe('Purchase order get by id tests', () => {
    it('Should return error required id', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(updateErr2Event));

        const result: APIGatewayProxyResult = await GetById(event);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(400);
        expect(body.message).toEqual('Required ID');
    });
    it('Should return purchase order json', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(getByIdEvent));

        const result: APIGatewayProxyResult = await GetById(event);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(200);
        expect(body.po.numberPO).toEqual('123');
    });
    it('Should return error purchase order not found', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(getByIdErrEvent));

        const result: APIGatewayProxyResult = await GetById(event);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(500);
        expect(body.message).toEqual('Purchase order not found');
    });
});
