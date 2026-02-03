import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, throwError } from 'rxjs';
import { Client, clientSchema, clientArraySchema } from '../../types/Client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl=`${environment.BACK_URL}/customers`
  constructor(private httpClient:HttpClient) { }

  private selectedClientSubject = new BehaviorSubject<any>(null);
  selectedClient$ = this.selectedClientSubject.asObservable();

  setSharedClient(client: any) {
    this.selectedClientSubject.next(client);
  }

  clearSharedClient() {
    this.selectedClientSubject.next(null);
  }

  getCustomers():Observable<Client[]>{
    return this.httpClient.get<Client[]>(`${this.baseUrl}`).pipe(
      map((data:any)=>{
        const response=clientArraySchema.safeParse(data.client);
        if(!response.success){
          console.log(response.error)
          throw new Error(`${response.error}`);
        }
        return response.data;
      })
    )
  } 

  getCustomerById(id:string):Observable<Client>{
    return this.httpClient.get<Client>(`${this.baseUrl}/${id}`).pipe(
      map((data:any)=>{
        const response=clientSchema.safeParse(data.client);
        if(!response.success){
          console.log(response.error)
          throw new Error(`${response.error}`);
        }
        return response.data;
      })
    )
  };

  getClientId(phoneOrEmail:string):Observable<Client>{
    return this.httpClient.get<Client>(`${this.baseUrl}/find`, {params: {phoneOrEmail}}).pipe(
      map(data => {
      const response = clientSchema.safeParse(data); 
      if (!response.success) {
        console.error('Error de validación:', response.error);
        throw new Error('La respuesta de la API no es válida');
      }
      return response.data;
    })
    );
  }

  createCustomer(clientData:any):Observable<Client>{
    return this.httpClient.post<Client>(this.baseUrl, clientData).pipe(
      map((data:any)=>{
        const response=clientSchema.safeParse(data);
        if(!response.success){
          console.log(response.error)
          throw new Error(`${response.error}`);
        }
        return response.data;
      })
    )
  };

}
