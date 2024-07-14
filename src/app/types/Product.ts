import { Category } from "./Category";

export class Product {
    id!: number;
    productName!: string;
    description!: string;
    category!: Category;
    price!: number;
    available!: boolean;
    quantity!: number;
    createAt!: string
}
