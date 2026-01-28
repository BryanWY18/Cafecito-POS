import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, throwError, tap, switchMap } from 'rxjs';
import { CreateSaleRequest, Sale, saleSchema } from '../../types/Sale';
import { Product } from '../../types/Products';

@Injectable({
  providedIn: 'root'  
})
export class SaleService {

  private baseUrl = `${environment.BACK_URL}/sales`;
  private currentSaleSubject = new BehaviorSubject<Sale | null>(null);
  private ticketResultSubject = new BehaviorSubject<Sale | null>(null);
  
  currentSale$ = this.currentSaleSubject.asObservable();
  ticketResult$ = this.ticketResultSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCurrentSale(): Observable<Sale | null> {
    return this.currentSale$;
  }

  addProductToSale(product:Product) {
    const currentSale = this.currentSaleSubject.value;
    const newItem = {
      productId: product,
      quantity: 1,
      price: product.price
    };
    if (!currentSale) {
      this.currentSaleSubject.next({ items: [newItem] } as any);
    } else {
      const existingIndex = currentSale.items.findIndex(
        item => (item.productId as any)._id === product._id
      );
      if (existingIndex >= 0) {
        currentSale.items[existingIndex].quantity += 1;
      } else {
        currentSale.items.push(newItem as any);
      }
      this.currentSaleSubject.next({ ...currentSale });
    }
  }

  updateQuantity(productId: string, newQuantity: number) {
    const currentSale = this.currentSaleSubject.value;
    if (!currentSale) return;

    const item = currentSale.items.find(i => (i.productId as any)._id === productId);
    if (item) {
      item.quantity = newQuantity;
      this.currentSaleSubject.next({ ...currentSale });
    }
  }

  removeProduct(productId: string) {
    const currentSale = this.currentSaleSubject.value;
    if (!currentSale) return;

    currentSale.items = currentSale.items.filter(i => (i.productId as any)._id !== productId);
    this.currentSaleSubject.next(currentSale.items.length > 0 ? { ...currentSale } : null);
  }

  calculateSubtotal(sale: Sale | null): number {
    if (!sale) return 0;
    return sale.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  }

  completeSale(customerId: string | null): Observable<Sale> {
    const currentSale = this.currentSaleSubject.value;
    if (!currentSale) return throwError(() => new Error('No hay venta activa'));

    const saleData: CreateSaleRequest = {
      customer: customerId || null,
      items: currentSale.items.map(item => ({
        productId: (item.productId as any)._id,
        quantity: item.quantity,
        price: item.unitPrice
      })),
      paymentMethod: 'cash',
      subTotal: this.calculateSubtotal(currentSale),
      discountPercent: 0,
      discountAmount: 0,
      total: this.calculateSubtotal(currentSale)
    }
    console.log(JSON.stringify(saleData))
    return this.http.post<Sale>(this.baseUrl, saleData).pipe(
    switchMap(res => {
        return this.http.get<Sale>(`${this.baseUrl}/${res.saleId}`)
      }),
      tap((ticketCompleto) =>{
        console.log(ticketCompleto)
        this.ticketResultSubject.next(ticketCompleto);
        this.cancelSale();
      })
    );
  };

  cancelSale() {
    this.currentSaleSubject.next(null);
  }

}