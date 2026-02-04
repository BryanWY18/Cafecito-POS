import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { User, UserCredentials } from '../../types/User';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl=`${environment.BACK_URL}/auth`;
  constructor(private httpClient:HttpClient) { }

  private selectedUserSubject = new BehaviorSubject<User | null>(null);
  selectedUser$ = this.selectedUserSubject.asObservable();

  setSharedUser(user: User) {
    this.selectedUserSubject.next(user);
  }

  login(credentials: UserCredentials): Observable<{ token: string, user: User }> {
    return this.httpClient.post<{ token: string, user: User }>(
      `${this.baseUrl}/login`,
      credentials
    );
  }

}
