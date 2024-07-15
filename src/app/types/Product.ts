import { Category } from "./Category";

export class Product {
    id!: number;
    productName!: string;
    description!: string;
    category!: Category;
    price!: any;
    available!: boolean;
    quantity!: number;
    createAt!: string
}
