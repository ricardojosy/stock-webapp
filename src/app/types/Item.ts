import { Product } from "./Product";

export class Item {
    id: number | undefined;
    product: Product | undefined;
    price: number | undefined;
    quantity: number | undefined;
    total: number | undefined;
    createAt: string | undefined
}
