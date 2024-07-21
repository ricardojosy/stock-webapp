import { Order } from "./Order";
import { Product } from "./Product";

export class ItemResponse {
    id!: number;
    product!: Product;
    price!: number;
    total!: number;
    quantity!: number;
    orderId!: undefined;
}
