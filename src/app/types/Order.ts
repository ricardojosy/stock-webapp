import { Client } from "./Client";
import { Item } from "./Item";

export class Order {
    id!: number;
    items!: Item[];
    client!: Client;
    total!: number;
    createAt!: string
}
