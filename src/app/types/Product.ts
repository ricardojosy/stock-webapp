import { Category } from "./Category";

export class Product {
    id: number | undefined;
    productName: string | undefined;
    description: string | undefined;
    category: Category | undefined;
    price: number | undefined;
    available: boolean | undefined;
    quantity: number | undefined;
    createAt: string | undefined
}
