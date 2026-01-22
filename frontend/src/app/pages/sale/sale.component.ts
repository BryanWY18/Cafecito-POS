import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SaleService } from '../../core/services/sale/sale.service';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Sale } from '../../core/types/Sale';
import { RouterLink } from "@angular/router";

export type preSale ={

}

@Component({
  selector: 'app-sale',
  standalone:true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})

export class SaleComponent {
  
  constructor(private saleService:SaleService){}

  sale$!: Observable<Sale | null>;
  customerId: string = '';
  totalProducts$!: Observable<number>;

  private saleSubject = new BehaviorSubject<Sale | null>(null);
 
  ngOnInit() {
    this.sale$ = this.saleService.getCurrentSale();
    this.sale$.subscribe(value => {
      console.log('Sale$ emitió:', value);
    });
    this.totalProducts$ = this.sale$.pipe(
      map(sale => 
      sale?.items?.reduce((total, item) => total + item.quantity, 0) || 0)
    );  
    this.loadCurrentSale();
  }

  updateQuantity(productId: string, newQuantity: number) {
    this.saleService.updateQuantity(productId, newQuantity);
  }

  removeProduct(productId: string) {
    this.saleService.removeProduct(productId);
  }

  clearSale() {
    if (confirm('¿Estás seguro de cancelar toda la venta?')) {
      this.saleService.cancelSale();
      this.customerId = '';
    }
  }

  createSale() {
    if (!this.customerId) {
      alert('Por favor ingresa el ID del cliente');
      return;
    }
      this.saleService.completeSale(this.customerId).subscribe({
      next: (sale) => {
        console.log('Venta completada:', sale);
        alert('¡Venta realizada con éxito!');
        this.customerId = '';
      },
      error: (error) => {
        console.error('Error al completar venta:', error);
        alert('Error al completar la venta. Intenta de nuevo.');
      }
    });
  }

  calculateSubtotal(sale: Sale): number {
    return sale.items.reduce((sum, item) => 
      sum + (item.productId.price * item.quantity), 0
    );
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }


  loadCurrentSale() {
  // Asumiendo que tienes un servicio de ventas
  this.saleService.getCurrentSale().subscribe({
    next: (sale) => {
      this.saleSubject.next(sale);
    },
    error: (error) => {
      console.error('Error al cargar venta:', error);
    }
  });
  }

}
