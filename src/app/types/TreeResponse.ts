import { ItemChild } from "./ItemChild";
import { OrderResponse } from "./OrderResponse";

export class TreeResponse {
    data!: OrderResponse;
    children!: ItemChild[];
}