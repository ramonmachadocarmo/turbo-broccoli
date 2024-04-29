import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetNextCode } from '../index';
import { expect, describe, it } from '@jest/globals';
import getNextCode from '../../events/getNextCode.json';

describe('Specific', () => {
    it('Should return nextcode', async () => {
        const event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(getNextCode));
        const result: APIGatewayProxyResult = await GetNextCode(event);
        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(200);
        expect(body.nextCode).toEqual('ISO000003');
    });
});
