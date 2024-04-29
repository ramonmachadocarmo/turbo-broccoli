import AWS from 'aws-sdk';
import POItem from '../../model/POItem';

const movementServiceLambda = new AWS.Lambda({});

export const sendToLambdaStock = async (items: POItem[]) => {
    try {
        const stocksWithoutWarehouse = getStockToAddressList(items);

        stocksWithoutWarehouse.forEach((stockToAddress) => {
            callLambdaSaveStock(stockToAddress);
        });
        return true;
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown Error';
        throw new Error(message);
    }
};

function getStockToAddressList(items: POItem[]) {
    const stocksWithoutWarehouse: object[] = [];
    items.forEach((el) => {
        stocksWithoutWarehouse.push({
            warehouse: '',
            product: el.product,
            quantity: el.quantity,
            blocked: 0,
            reserved: 0,
        });
    });
    return stocksWithoutWarehouse;
}

async function callLambdaSaveStock(movement: object) {
    try {
        const params = {
            FunctionName: 'lambda-stock-Save-YPXGnk7HWE8V',
            InvocationType: 'RequestResponse',
            Payload: JSON.stringify(movement),
        };
        return await movementServiceLambda.invoke(params).promise();
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown Error';
        throw new Error(message);
    }
}
