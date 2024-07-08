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

import { MenuComponent } from '../../components/menu/menu.component';
import { Category } from '../../types/Category';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../types/Product';

@Component({
  selector: 'app-home',
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
  ],
  providers: [
    ProductService,
    CategoryService,
    MessageService,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {

  protected form: FormGroup = new FormGroup({
    productName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)]),
    price: new FormControl(0, [Validators.required, Validators.min(0.50)]),
    available: new FormControl(''),
    quantity: new FormControl(0, [Validators.required, Validators.min(1)]),
    category: new FormControl(Category, Validators.required),
  });

  categories: Category[] = [];
  products: Product[] = [];

  selectedProduct: Product | undefined;
  protected msg: string = '';
  protected hdrMsg: string = '';

  username: any | undefined;

  page = 0;
  size = 20;
  rows = 5;

  constructor(
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.username = sessionStorage.getItem("username");
    this.categoryService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data['content'];
      },
      error: (e) => {
        if (e.status == '401') {
          this.msg = 'Unauthorized. Verify yours credentials.';
          this.hdrMsg = 'Error';
          this.showMsg();
        }
        if (e.status == '403') {
          this.msg = 'You are not allowed!';
          this.hdrMsg = 'Error';
          this.showMsg();
        }
        if (e.status == '500') {
          this.msg = 'Internal error, please notify the suport!';
          this.hdrMsg = 'Error';
          this.showMsg();
        }
        setTimeout(() => { this.router.navigate(["login"]) }, 1500);
      }
    });
    this.getPageOfProducts();
  }

  getPageOfProducts() {
    this.productService.getPageOfProducts(this.page, this.size).subscribe({
      next: (data: any) => { this.products = data['content']; },
      error: (e) => {
        if (e.status == '403') {
          this.msg = 'You are not allowed!';
          this.hdrMsg = 'Error';
          this.showMsg();
        }
        if (e.status == '500') {
          this.msg = 'Internal error, please notify the suport!';
          this.hdrMsg = 'Error';
          this.showMsg();
        }
        setTimeout(() => { this.router.navigate(["login"]) }, 2000);
      }
    });
  }

  onRowSelect(event: any) {
    this.form.setValue({
      productName: this.selectedProduct?.productName,
      description: this.selectedProduct?.description,
      price: this.selectedProduct?.price,
      quantity: this.selectedProduct?.quantity,
      available: this.selectedProduct?.available,
      category: this.selectedProduct?.category
    });
    console.log(JSON.stringify(this.selectedProduct, null, 2));
  }

  onRowUnselect(event: any) {
    this.selectedProduct = undefined;
    this.form.reset();
  }

  addProduct() {
    const product = this.form.value as Product;
    if (!product.category?.id) {
      this.msg = 'Category is required';
      this.hdrMsg = 'Error';
      this.showMsg();
      return;
    }
    this.productService.addProduct(product).subscribe({
      next: (data: any) => {
        this.onRowUnselect(null);
        this.getPageOfProducts();
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

  updateProduct() {
    const product = this.form.value as Product;
    product.id = this.selectedProduct?.id;
    this.productService.updateProduct(product).subscribe({
      next: (data: any) => {
        this.onRowUnselect(null);
        this.getPageOfProducts();
        this.msg = 'Product updated with success!';
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

  deleteProduct() {
    const id: number = this.selectedProduct?.id!;
    this.productService.deleteProduct(id).subscribe({
      next: (data: any) => {
        this.onRowUnselect(null);
        this.getPageOfProducts();
        this.msg = 'Product deleted with success!';
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
    this.deleteProduct();
  }

  onReject() {
    this.messageService.clear('confirm');
  }
}
