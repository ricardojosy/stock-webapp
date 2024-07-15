import { ItemResponse } from "./ItemResponse";

export class OrderResponse {
    id!: number;
    total!: number;
    date!: Date;
    items!: ItemResponse[];
}