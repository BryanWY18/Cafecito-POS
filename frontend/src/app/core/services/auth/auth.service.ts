import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {jwtDecode} from 'jwt-decode';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import {environment} from '../../../../environments/environment.development';
import { boolean } from 'zod';

export type decodedToken = {
  userId:string;
  displayName: string;
  role: 'admin' | 'seller';
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl=`${environment.BACK_URL}`

  private readonly httpClient = inject(HttpClient);

  checkEmailExist(email:string):Observable<boolean>{
    return this.httpClient
      .get<{exists:boolean}>(`${this.baseUrl}/auth/check-email`,{
        params:{email},
      })
      .pipe(map((res)=>res.exists));
  }

  checkClientExist(phoneOrEmail:string):Observable<boolean>{
    return this.httpClient
      .get<{exists:boolean}>(`${this.baseUrl}/auth/check-client`,{
        params:{phoneOrEmail},
      })
      .pipe(map((res)=> res.exists));
  };
}
