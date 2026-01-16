import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Product, ProductResponse } from '../../types/Products';

export type filters = {
  q?: string;
};

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private baseUrl=`${environment.BACK_URL}/products`
  constructor(private httpClient:HttpClient) {}

  getProducts(page:number=1, limit:number=10){
    return this.httpClient
      .get<ProductResponse>(this.baseUrl,{params:{page,limit}})
      .pipe(catchError((error)=>throwError(()=> new Error(error))));
  }
  
  getProductsById(id:string):Observable<Product>{
    return this.httpClient.get<Product>(`${this.baseUrl}/${id}`);
  };

  searchProducs(search:filters):Observable<Product[]>{
    let filters:any={}
    if(search.q){
      filters.q=search.q
    }
    const params = new HttpParams({fromObject:filters});
    return this.httpClient.get<ProductResponse>(`${this.baseUrl}/`,{params})
      .pipe(map(response=>{
        return response.products || [];;
      })
    )
  };

}
