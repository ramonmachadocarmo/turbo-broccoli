import dynamoDBClient from '../model';
import SupplierService from './service';

const supplierService = new SupplierService(dynamoDBClient);

export default supplierService;
