import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../types/Order';
import { OrderResponse } from '../types/OrderResponse';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  apiUrl: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  getOrder(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(this.apiUrl + '/api/v1/orders/' + id, {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
      })
    });
  }

  getOrders(): Observable<any> {
    return this.http.get<OrderResponse[]>(this.apiUrl + '/api/v1/orders', {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
      })
    });
  }

  public addOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl + '/api/v1/orders', order, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
      })
    });
  }

  public updateOrder(order: Order): Observable<Order> {
    return this.http.patch<Order>(this.apiUrl + '/api/v1/orders/' + order.id, order, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
      })
    });
  }

  public deleteOrder(id: number): Observable<object> {
    return this.http.delete(this.apiUrl + '/api/v1/orders/' + id, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
      })
    });
  }

}
