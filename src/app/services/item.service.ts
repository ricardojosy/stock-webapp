import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../types/Item';
import { ItemResponse } from '../types/ItemResponse';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  apiUrl: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  getItem(id: number): Observable<ItemResponse> {
    return this.http.get<ItemResponse>(this.apiUrl + '/api/v1/items/' + id, {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
      })
    });
  }

  getItems(): Observable<any> {
    return this.http.get<ItemResponse[]>(this.apiUrl + '/api/v1/items', {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
      })
    });
  }

  public addItem(item: Item): Observable<ItemResponse> {
    return this.http.post<ItemResponse>(this.apiUrl + '/api/v1/items', item, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
      })
    });
  }

  public updateItem(item: Item): Observable<object> {
    return this.http.patch<ItemResponse>(this.apiUrl + '/api/v1/items/' + item.id + '/' + item.orderId, item, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
      })
    });
  }

  public deleteItem(itemId: number, orderId: number): Observable<object> {
    return this.http.delete(this.apiUrl + '/api/v1/items/' + itemId + '/' + orderId, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
      })
    });
  }

}
