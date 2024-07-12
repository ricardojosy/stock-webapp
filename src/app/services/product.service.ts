import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../types/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiUrl: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl + '/api/v1/products/listOrdered', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
      })
    });
  }

  getProductsStartingWith(productName: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl + '/api/v1/products/' + productName + '/nameStarting', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
      })
    });
  }

  getPageOfProducts(page: number, size: number): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl + '/api/v1/products?page=' + page + '&size=' + size + '&sort=productName', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
      })
    });
  }

  public addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl + '/api/v1/products', product, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
      })
    });
  }

  public updateProduct(product: Product): Observable<Product> {
    return this.http.patch<Product>(this.apiUrl + '/api/v1/products/' + product.id, product, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
      })
    });
  }

  public deleteProduct(id: number): Observable<object> {
    return this.http.delete(this.apiUrl + '/api/v1/products/' + id, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
      })
    });
  }

}
