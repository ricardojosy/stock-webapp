import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl: string = "http://localhost:8080"

  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/api/v1/login", { username, password }).pipe(
      tap((value) => {
        sessionStorage.setItem("accessToken", value.accessToken)
        sessionStorage.setItem("expires", value.expires)
        sessionStorage.setItem("username", value.username)
      })
    )
  }
}
