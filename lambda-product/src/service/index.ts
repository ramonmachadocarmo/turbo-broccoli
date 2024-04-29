import dynamoDBClient from '../model';
import ProductService from './service';

const productService = new ProductService(dynamoDBClient);

export default productService;
