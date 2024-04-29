import IPOItem from './POItem';

export default interface IPO {
    id: string;
    numberPO: string;
    supplier: string;
    purchaseDate: Date;
    value: number;
    discount: number;
    status: string;
    paymentCondition: string;
    items: IPOItem[];
    createdAt: Date;
    updatedAt: Date | undefined;
}
