import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { User, UserCredentials, UsersResponse } from '../../types/User';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AuthService, decodedToken } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrlUsers=`${environment.BACK_URL}/users`;
  private readonly httpClient = inject(HttpClient);

  private selectedUserSubject = new BehaviorSubject<decodedToken | null>(null);
  selectedUser$ = this.selectedUserSubject.asObservable();

  setSharedUser(user: decodedToken) {
    this.selectedUserSubject.next(user);
  }

  clearUser(): void {
    this.selectedUserSubject.next(null);
  }

getUsers(): Observable<User[]> {
  return this.httpClient
    .get<UsersResponse>(`${this.baseUrlUsers}/all-users`)
    .pipe(
      map(response => response.users)
    );
}

}
