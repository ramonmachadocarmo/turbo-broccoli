import dynamoDBClient from '../model';
import POService from './service';

const pOService = new POService(dynamoDBClient);

export default pOService;
