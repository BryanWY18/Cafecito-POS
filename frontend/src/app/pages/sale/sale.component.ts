import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SaleService } from '../../core/services/sale/sale.service';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Sale } from '../../core/types/Sale';
import { RouterLink } from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sale',
  standalone:true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})

export class SaleComponent implements OnInit {

  sale$: Observable<Sale | null> = of(null);
  totalProducts$: Observable<number> = of(0);
  customerId: string = '';

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {
    this.sale$ = this.saleService.currentSale$;
    this.totalProducts$ = this.sale$.pipe(
      map(sale => sale?.items?.reduce((total, item) => total + item.quantity, 0) || 0)
    );
  }
  updateQuantity(productId: string, newQuantity: number) {
    this.saleService.updateQuantity(productId, newQuantity);
  }

  removeProduct(productId: string) {
    this.saleService.removeProduct(productId);
  }

  clearSale() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se borrarán todos los productos de la lista",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar todo',
      cancelButtonText: 'No, mantener'
    }).then((result) => {
      if (result.isConfirmed) {
        this.saleService.cancelSale();
        this.customerId = '';
        Swal.fire('Eliminado', 'La venta ha sido cancelada', 'success');
      }
    });
  }

  createSale() {
    this.saleService.completeSale(this.customerId).subscribe({
      next: () => {
        alert('Venta realizada con éxito!');
        this.customerId = '';
      },
      error: (err) => alert('Error al completar la venta: ' + err.message)
    });
  }

  calculateSubtotal(sale: Sale | null): number {
    return this.saleService.calculateSubtotal(sale);
  }

}