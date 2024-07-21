import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DividerModule } from 'primeng/divider';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { TreeTableModule } from 'primeng/treetable';

import { MenuComponent } from '../../components/menu/menu.component';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { ItemService } from '../../services/item.service';
import { Client } from '../../types/Client';
import { Item } from '../../types/Item';
import { Order } from '../../types/Order';
import { OrderResponse } from '../../types/OrderResponse';
import { ItemResponse } from '../../types/ItemResponse';
import { Product } from '../../types/Product';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    MenuComponent,
    TableModule,
    CommonModule,
    ScrollPanelModule,
    ToastModule,
    FormsModule,
    CheckboxModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    ReactiveFormsModule,
    InputSwitchModule,
    DividerModule,
    AutoCompleteModule,
    TreeTableModule,
  ],
  providers: [
    ProductService,
    MessageService,
    OrderService,
    ItemService,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  // form.get('first')?.enable();
  // form.get('last')?.disable();

  protected form: FormGroup = new FormGroup({
    product: new FormControl('', Validators.required),
    price: new FormControl({ value: 0, disabled: true }),
    quantity: new FormControl(1, Validators.required),
    total: new FormControl({ value: 0, disabled: true }),
  });

  protected products: any[] = [];
  protected filteredProducts: any[] = [];
  protected clients: any[] = [];
  protected orders!: any[];
  protected items!: any[];

  protected selectedProduct!: any;
  protected selectedItem!: any;
  protected selectedOrder!: any;
  protected selectedClient!: any;

  protected msg: string = '';
  protected hdrMsg: string = '';

  username: any | undefined;

  page = 0;
  size = 20;
  rows = 5;

  constructor(
    private router: Router,
    private productService: ProductService,
    private orderService: OrderService,
    private itemService: ItemService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.clients = JSON.parse('[{"id": 1, "name": "Client 1"}, {"id": 2, "name": "Client 2"}, {"id": 3, "name": "Client 3"}]');
    // console.log(JSON.stringify(this.clients, null, 2));
    this.username = sessionStorage.getItem("username");
    this.getProducts();
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        // console.log(`ORDERS: ${JSON.stringify(this.orders, null, 2)}`);
      },
      error: (e) => {
        console.log(`ERROR: ${JSON.stringify(e, null, 2)}`);
        this.credentialsErrorMsg(e);
        this.notAllowedMsg(e);
        this.insternalErrorMsg(e);
        setTimeout(() => { this.router.navigate(["login"]) }, 2000);
      }
    });
  }

  getOrder(id: number) {
    this.orderService.getOrder(id).subscribe({
      next: (data) => {
        this.selectedOrder = data;
        // console.log(`ORDER: ${JSON.stringify(this.selectedOrder, null, 2)}`);
      },
      error: (e) => {
        console.log(JSON.stringify(e, null, 2));
        this.credentialsErrorMsg(e);
        this.notAllowedMsg(e);
        this.insternalErrorMsg(e);
        setTimeout(() => { this.router.navigate(["login"]) }, 2000);
      }
    });
  }

  back() {
    this.selectedOrder.items = undefined;
    this.selectedOrder = undefined;
    this.selectedProduct = undefined;
    this.items = [];
    this.getOrders();
    this.form.reset();
    // console.log(`BACK: ${JSON.stringify(this.selectedOrder, null, 2)}`);
  }

  getProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        // console.log(`PRODUCTS: ${JSON.stringify(this.products, null, 2)}`);
      },
      error: (e) => {
        this.credentialsErrorMsg(e);
        this.notAllowedMsg(e);
        this.insternalErrorMsg(e);
        setTimeout(() => { this.router.navigate(["login"]) }, 2000);
      }
    });
  }

  onSelectProduct(event: any) {
    this.selectedProduct = event.value;
    let price = 0;
    let total = 0;
    let quantity = 1;
    price = this.selectedProduct.price;
    total = price * this.form.value.quantity;
    this.form.patchValue({
      quantity: quantity,
      price: price,
      total: total,
    });
    this.form.value.price = price;
    this.form.value.total = total;
    // console.log(`FORM 1: ${JSON.stringify(this.form.value, null, 2)}`);
  }

  getTotalItem() {
    const price: any = this.selectedItem.product.price;
    let quantity = this.form.value.quantity;
    let total: number = parseFloat(price) * quantity;
    this.form.patchValue({
      quantity: quantity,
      price: price,
      total: total
    });
    this.form.value.price = price;
    this.form.value.total = total;
    this.form.value.total = total;
    // console.log(`FORM 2: ${JSON.stringify(this.form.value, null, 2)}`);
  }

  filterProduct(event: AutoCompleteCompleteEvent) {
    if (event.query.length > 2) {
      this.productService.getProductsStartingWith(event.query.trimEnd()).subscribe({
        next: (data) => {
          this.filteredProducts = data;
          // console.log(JSON.stringify(this.filteredProducts, null, 2));
        },
        error: (e) => {
          this.credentialsErrorMsg(e);
          this.notAllowedMsg(e);
          this.insternalErrorMsg(e);
          setTimeout(() => { this.router.navigate(["login"]) }, 2000);
        }
      });
    }
  }

  onOrderSelect() {
    this.items = this.selectedOrder.items;
    this.sortItems();
  }

  onBackToOrders(event: any) {
    this.selectedOrder = new OrderResponse();
    this.items = this.selectedOrder.items;
    this.form.reset();
  }

  onItemRowSelect(event: any) {
    // console.log(`ITEM: ${JSON.stringify(event, null, 2)}`);
    const item = event.data;
    this.form.setValue({
      product: item.product,
      price: item.price,
      quantity: item.quantity,
      total: item.total
    });
    // console.log(JSON.stringify(this.selectedItem, null, 2));
  }

  onItemRowUnselect(event: any) {
    this.selectedItem = undefined;
    this.form.value.quantity = 1;
    this.form.reset();
  }

  addOrder() {
    const order = new Order();
    order.client = new Client();
    order.items = [];
    this.orderService.addOrder(order).subscribe({
      next: (data: any) => {
        this.onItemRowUnselect(null);
        this.msg = 'New Order created!';
        this.hdrMsg = 'Success';
        this.selectedOrder = data
        // console.log(JSON.stringify(this.selectedOrder, null, 2));
        this.showMsg();
      },
      error: (e) => {
        this.credentialsErrorMsg(e);
        this.notAllowedMsg(e);
        this.insternalErrorMsg(e);
        setTimeout(() => { this.router.navigate(["login"]) }, 1500);
      }
    });
  }

  addItem() {
    // console.log(`FORM: ${JSON.stringify(this.form.value, null, 2)}`);
    const product = this.form.value.product;
    if (!product?.id) {
      this.msg = 'Product is required';
      this.hdrMsg = 'Error';
      this.showMsg();
      return;
    }
    const item = new Item;
    item.product = product;
    item.price = this.form.value.price;
    item.quantity = this.form.value.quantity;
    item.total = this.form.value.total;
    item.orderId = this.selectedOrder.id;
    this.selectedOrder.items.push(item);
    this.selectedOrder.total += item.total;
    // console.log(`ORDER 1: ${JSON.stringify(this.selectedOrder, null, 2)}`);
    // console.log(`ITEM: ${JSON.stringify(item, null, 2)}`);
    // console.log(`ORDER 2: ${JSON.stringify(this.selectedOrder, null, 2)}`);
    this.itemService.addItem(item).subscribe({
      next: (data: any) => {
        this.onItemRowUnselect(null);
        this.msg = 'New Item created!';
        this.hdrMsg = 'Success';
        this.getOrder(this.selectedOrder.id);
        console.log(`ORDER 2: ${JSON.stringify(this.selectedOrder, null, 2)}`);
        this.onOrderSelect();
        this.selectedProduct = new Product();
        this.showMsg();
      },
      error: (e) => {
        this.credentialsErrorMsg(e);
        this.notAllowedMsg(e);
        this.insternalErrorMsg(e);
        // setTimeout(() => { this.router.navigate(["login"]) }, 1500);
      }
    });
  }

  sortItems() {
    // console.log(`ANTES: ${JSON.stringify(this.items, null, 2)}`);
    this.items.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    });
    // console.log(`DEPOIS: ${JSON.stringify(this.items, null, 2)}`);
  }

  updateItem() {
    const item = this.form.value as Item;
    item.orderId = this.selectedOrder.id;
    item.createAt = this.selectedItem.createAt; 
    // console.log(`ITEM: ${JSON.stringify(item, null, 2)}`);
    item.id = this.selectedItem?.id;
    this.itemService.updateItem(item).subscribe({
      next: (data: any) => {
        this.onItemRowUnselect(null);
        this.onOrderSelect();
        this.msg = 'Item updated with success!';
        this.hdrMsg = 'Success';
        this.showMsg();
      },
      error: (e) => {
        this.credentialsErrorMsg(e);
        this.notAllowedMsg(e);
        this.insternalErrorMsg(e);
        // setTimeout(() => { this.router.navigate(["login"]) }, 1500);
      }
    });
  }

  deleteItem() {
    const itemId: number = this.selectedItem.id;
    const orderId: number = this.selectedOrder.id;
    let index = this.items.indexOf(this.selectedItem);
    // console.log(`ITEM: ${JSON.stringify(index, null, 2)}`);
    this.itemService.deleteItem(itemId, orderId).subscribe({
      next: (data: any) => {
        this.onItemRowUnselect(null);
        this.msg = 'Item deleted with success!';
        this.hdrMsg = 'Success';
        this.items.splice(index, 1);
        this.getOrder(this.selectedOrder.id);
        this.onOrderSelect();
        this.showMsg();
      },
      error: (e) => {
        this.credentialsErrorMsg(e);
        this.notAllowedMsg(e);
        this.insternalErrorMsg(e);
        // setTimeout(() => { this.router.navigate(["login"]) }, 1500);
      }
    });
  }

  credentialsErrorMsg(e: any) {
    if (e.status == '401') {
      this.msg = 'Unauthorized. Verify yours credentials.';
      this.hdrMsg = 'Error';
      this.showMsg();
    }
  }

  notAllowedMsg(e: any) {
    if (e.status == '403') {
      this.msg = 'You are not allowed!';
      this.hdrMsg = 'Error';
      this.showMsg();
    }
  }

  insternalErrorMsg(e: any) {
    if (e.status == '500') {
      this.msg = 'Internal error, please notify the suport!';
      this.hdrMsg = 'Error';
      this.showMsg();
    }
  }

  showMsg() {
    let sev: string = '';
    if (this.hdrMsg == 'Success') { sev = 'success'; }
    if (this.hdrMsg == 'Warning') { sev = 'warn'; }
    if (this.hdrMsg == 'Error') { sev = 'error'; }
    this.messageService.add({ key: 'msgs', sticky: false, severity: sev, summary: this.msg, life: 1500 });
  }

  showConfirm(item: any) {
    this.selectedItem = item;
    this.messageService.add({ key: 'confirm', sticky: true, severity: 'warn', summary: 'Are you sure?' });
  }

  onConfirm() {
    this.messageService.clear('confirm');
    this.deleteItem();
  }

  onReject() {
    this.messageService.clear('confirm');
  }
}
