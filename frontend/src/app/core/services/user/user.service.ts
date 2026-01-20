import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl=`${environment.BACK_URL}/`
  constructor(private httpClient:HttpClient) { }
}
