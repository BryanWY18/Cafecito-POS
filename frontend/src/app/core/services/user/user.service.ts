import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { User } from '../../types/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl=`${environment.BACK_URL}/users`;

  constructor(private httpClient:HttpClient) { }

}
