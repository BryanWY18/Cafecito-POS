import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { User, UserCredentials } from '../../types/User';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { decodedToken } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl=`${environment.BACK_URL}/auth`;
  constructor(private httpClient:HttpClient) { }

  private selectedUserSubject = new BehaviorSubject<decodedToken | null>(null);
  selectedUser$ = this.selectedUserSubject.asObservable();

  setSharedUser(user: decodedToken) {
    this.selectedUserSubject.next(user);
  }

  clearUser(): void {
    this.selectedUserSubject.next(null);
  }

}
