import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { CreateSale, Sale, saleSchema } from '../../types/Sale';
import z from 'zod';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  
  private baseUrl=`${environment.BACK_URL}/sales`;

  constructor(private httpClient:HttpClient) { }

  createSale(saleData: CreateSale): Observable<Sale> {
  return this.httpClient.post<Sale>(`${this.baseUrl}`, saleData).pipe(
      map((data)=>{
        const response=saleSchema.safeParse(data);
        if(!response.success){
          console.log(response.error)
          throw new Error(`${response.error}`);
        }
        return response.data;
      }),
      catchError((error) => {
        console.error('Error al crear venta:', error);
        return throwError(() => error);
      })
    )
}

  getAllSales(): Observable<Sale[]> {
      return this.httpClient.get<Sale[]>(this.baseUrl).pipe(
        map(data => {
          const response = z.array(saleSchema).safeParse(data);
          if (!response.success) {
            console.error('Zod Validation Error (Sales List):', response.error);
            throw new Error('La lista de ventas contiene datos corruptos');
          }
          return response.data;
        }),
        catchError(error => {
          console.error('Error al obtener ventas:', error);
          return throwError(() => error);
        })
      );
  }

}
