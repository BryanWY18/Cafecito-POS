import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {jwtDecode} from 'jwt-decode';
import { map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {environment} from '../../../../environments/environment.development';
import { boolean } from 'zod';
import { LoginResponse, User, UserCredentials } from '../../types/User';

export type decodedToken = {
  userId:string;
  displayName: string;
  role: 'admin' | 'seller';
  iat?: number;
  exp?: number;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl=`${environment.BACK_URL}/auth`

  private readonly httpClient = inject(HttpClient);

  checkEmailExist(email:string):Observable<boolean>{
    return this.httpClient
      .get<{exists:boolean}>(`${this.baseUrl}/check-email`,{
        params:{email},
      })
      .pipe(map((res)=>res.exists));
  }

  checkClientExist(phoneOrEmail:string):Observable<boolean>{
    return this.httpClient
      .get<{exists:boolean}>(`${this.baseUrl}/check-client`,{
        params:{phoneOrEmail},
      })
      .pipe(map((res)=> res.exists));
  };

  login(credentials: UserCredentials): Observable<decodedToken> {
    return this.httpClient.post<LoginResponse>(
      `${this.baseUrl}/login`,
      credentials
    ).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
      }),
      map((response) => {
        const decoded = jwtDecode<decodedToken>(response.token);
        return decoded;
      })
    );
  }

  getCurrentUser(): decodedToken | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return jwtDecode<decodedToken>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded = jwtDecode<decodedToken>(token);
      if (decoded.exp) {
        return decoded.exp * 1000 > Date.now();
      }
      return true;
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

}
