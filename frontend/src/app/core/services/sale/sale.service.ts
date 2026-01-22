import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { CreateSaleRequest, Sale, saleSchema } from '../../types/Sale';
import z from 'zod';

@Injectable({
  providedIn: 'root'  
})
export class SaleService {
  
  private baseUrl=`${environment.BACK_URL}/sales`;

  private currentSaleSubject = new BehaviorSubject<Sale | null>(null);
  currentSale$ = this.currentSaleSubject.asObservable();

  constructor(private httpClient:HttpClient) { }

  getCurrentSale(): Observable<Sale | null> {
    return this.currentSale$;
  }

  addProductToSale(product: any, quantity: number) {
    const currentSale = this.currentSaleSubject.value;
    if (!currentSale) {
      // Crear nueva venta
      const newSale: Sale = {
          items: [{
            productId: product,
            quantity: quantity,
            price: product.price
          }]
        } as Sale;
      this.currentSaleSubject.next(newSale);
    } else {
      // Verificar si el producto ya está
      const existingItemIndex = currentSale.items.findIndex(
        item => item.productId._id === product._id
      );
      if (existingItemIndex >= 0) {
        // Producto existe, actualizar cantidad
        currentSale.items[existingItemIndex].quantity += quantity;
      } else {
        // Producto nuevo: agregar al array
        currentSale.items.push({
          productId: product,
          quantity: quantity,
          price: product.price
        });
      }
      
      this.currentSaleSubject.next({...currentSale});
    }
  }

  // Actualizar cantidad de un producto
  updateQuantity(productId: string, newQuantity: number) {
    const currentSale = this.currentSaleSubject.value;
    if (!currentSale) 
      return;
    const itemIndex = currentSale.items.findIndex(
      item => item.productId._id === productId
    );
    if (itemIndex >= 0) {
      currentSale.items[itemIndex].quantity = newQuantity;
      this.currentSaleSubject.next({...currentSale});
    }
  }

  // Remover producto de la venta
  removeProduct(productId: string) {
    const currentSale = this.currentSaleSubject.value;
    if (!currentSale) 
      return;
    currentSale.items = currentSale.items.filter(
      item => item.productId._id !== productId
    );
    if (currentSale.items.length === 0) {
      this.currentSaleSubject.next(null);
    } else {
      this.currentSaleSubject.next({...currentSale});
    }
  }

  // Cancelar venta
  cancelSale() {
    this.currentSaleSubject.next(null);
  }

  // Completar la venta (enviar al backend)
  completeSale(
    customerId: string, 
    paymentMethod: string = 'Efectivo',
    discountPercent: number = 0
    ): Observable<Sale> {
    const currentSale = this.currentSaleSubject.value;
    if (!currentSale) {
      return throwError(() => new Error('No hay venta activa'));
    }

    // Calcular totales
    const subTotal = currentSale.items.reduce((sum, item) => 
      sum + (item.productId.price * item.quantity), 0
    );
    
    const discountAmount = (subTotal * discountPercent) / 100;
    const total = subTotal - discountAmount;

    // Ahora CreateSaleRequest acepta strings ✅
    const saleData: CreateSaleRequest = {
      customer: customerId,
      items: currentSale.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price
      })),
      paymentMethod: paymentMethod,
      subTotal: subTotal,
      discountPercent: discountPercent,
      discountAmount: discountAmount,
      total: total
    };

    return this.createSale(saleData).pipe(
      map(sale => {
        this.cancelSale();
        return sale;
      })
    );
  }

  // Actualiza la firma del método
  createSale(saleData: CreateSaleRequest): Observable<Sale> {
    return this.httpClient.post<Sale>(`${this.baseUrl}`, saleData).pipe(
      map((data) => {
        const response = saleSchema.safeParse(data);
        if (!response.success) {
          console.log(response.error);
          throw new Error(`${response.error}`);
        }
        return response.data;
      }),
      catchError((error) => {
        console.error('Error al crear venta:', error);
        return throwError(() => error);
      })
    );
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
