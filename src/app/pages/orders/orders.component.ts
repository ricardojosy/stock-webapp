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

import { MenuComponent } from '../../components/menu/menu.component';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../types/Product';
import { Client } from '../../types/Client';
import { Item } from '../../types/Item';
import { Order } from '../../types/Order';

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
  ],
  providers: [
    ProductService,
    CategoryService,
    MessageService,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  protected form: FormGroup = new FormGroup({
    product: new FormControl('', Validators.required),
    price: new FormControl({ value: 0, disabled: true }),
    quantity: new FormControl(1, Validators.required),
    totalItem: new FormControl({ value: 0, disabled: true }),
  });

  protected products: Product[] = [];
  protected filteredProducts: Product[] = [];
  protected clients: Client[] = [];
  protected items: Item[] = [];

  protected selectedProduct: Product = new Product();
  protected selectedItem: Item = new Item();
  protected selectedOrder: Order = new Order();
  protected selectedClient: Client = new Client();

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
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.clients = JSON.parse('[{"id": 1, "name": "Client 1"}, {"id": 2, "name": "Client 2"}, {"id": 3, "name": "Client 3"}]');
    // console.log(JSON.stringify(this.clients, null, 2));
    this.username = sessionStorage.getItem("username");
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        // console.log(JSON.stringify(this.products, null, 2));
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
    console.log(JSON.stringify(event, null, 2));
    this.selectedProduct = event.value;
    const price: any = this.selectedProduct?.price;
    const total = parseInt(this.form.value.quantity) * parseFloat(price);
    this.form.patchValue({
      price: price,
      totalItem: total,
    });
  }

  getTotalItem(event: any) {
    const price: any = this.selectedProduct?.price;
    const total: number = parseFloat(price) * this.form.value.quantity;
    this.form.patchValue({
      totalItem: total
    });
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

  onRowSelect(event: any) {
    this.form.setValue({
      product: this.selectedItem?.product,
      price: this.selectedItem?.price,
      quantity: this.selectedItem?.quantity,
      totalItem: this.selectedItem?.total
    });
    // console.log(JSON.stringify(this.selectedItem, null, 2));
  }

  onRowUnselect(event: any) {
    this.selectedItem = new Item();
    this.form.reset();
  }

  addOrder(order: Order) {
    this.orderService.addOrder(order).subscribe({
      next: (data: any) => {
        this.onRowUnselect(null);
        this.getItems();
        this.msg = 'Product added with success!';
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

  addItem() {
    const order = this.form.value as Item;
    if (!order.product?.id) {
      this.msg = 'Product is required';
      this.hdrMsg = 'Error';
      this.showMsg();
      return;
    }
    if (!this.selectedOrder.id) {
      this.addOrder(this.selectedOrder);
    }
    if (this.items.length == 0) {
      return;
    }
  }
  
  getItems() {

  }

  updateItem() {
    // const order = this.form.value as Item;
    // item.id = this.selectedItem?.id;
    // this.productService.updateProduct(product).subscribe({
    //   next: (data: any) => {
    //     this.onRowUnselect(null);
    //     this.getPageOfProducts();
    //     this.msg = 'Product updated with success!';
    //     this.hdrMsg = 'Success';
    //     this.showMsg();
    //   },
    //   error: (e) => {
    //     this.credentialsErrorMsg(e);
    //     this.notAllowedMsg(e);
    //     this.insternalErrorMsg(e);
    //     // setTimeout(() => { this.router.navigate(["login"]) }, 1500);
    //   }
    // });
  }

  deleteItem() {
    // const id: number = this.selectedItem?.id!;
    // this.productService.deleteProduct(id).subscribe({
    //   next: (data: any) => {
    //     this.onRowUnselect(null);
    //     this.getPageOfProducts();
    //     this.msg = 'Product deleted with success!';
    //     this.hdrMsg = 'Success';
    //     this.showMsg();
    //   },
    //   error: (e) => {
    //     this.credentialsErrorMsg(e);
    //     this.notAllowedMsg(e);
    //     this.insternalErrorMsg(e);
    //     // setTimeout(() => { this.router.navigate(["login"]) }, 1500);
    //   }
    // });
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

  showConfirm() {
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
