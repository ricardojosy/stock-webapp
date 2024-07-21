import { Product } from "./Product";

export class Item {
    id!: number;
    product!: Product;
    price!: number;
    total!: number;
    quantity!: number;
    orderId!: number;
    createAt!: string;
}
