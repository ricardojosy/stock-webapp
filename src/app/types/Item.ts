import { Product } from "./Product";

export class Item {
    id!: number;
    product!: Product;
    price!: number;
    quantity!: number;
    total!: number;
    createAt!: string
}
