import { Client } from "./Client";
import { Item } from "./Item";

export class Order {
    id: number | undefined;
    items: Item[] | undefined;
    client: Client | undefined;
    total: number | undefined;
    createAt: string | undefined
}
