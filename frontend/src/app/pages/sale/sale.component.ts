import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SaleService } from '../../core/services/sale/sale.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { Sale } from '../../core/types/Sale';
import { Router, RouterLink } from "@angular/router";
import Swal from 'sweetalert2';
import { ClientService } from '../../core/services/client/client.service';

@Component({
  selector: 'app-sale',
  standalone:true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})

export class SaleComponent implements OnInit, OnDestroy {

  sale$: Observable<Sale | null> = of(null);
  totalProducts$: Observable<number> = of(0);
  customerId: string = '';
  phoneOrEmail:string='';
  private destroy$ = new Subject<void>();

  constructor(private saleService: SaleService, private clientService:ClientService ,private router:Router) {}

  ngOnInit(): void {
    this.sale$ = this.saleService.currentSale$;
    this.totalProducts$ = this.sale$.pipe(
      map(sale => sale?.items?.reduce((total, item) => total + item.quantity, 0) || 0)
    );
    this.clientService.selectedClient$
      .pipe(takeUntil(this.destroy$))
      .subscribe(client => {
      if (client) {
        this.customerId = client._id;
        this.phoneOrEmail = client.name;
        this.clientService.clearSharedClient();
      }
    });
  }
  
  updateQuantity(productId: string, newQuantity: number) {
    this.saleService.updateQuantity(productId, newQuantity);
  }

  removeProduct(productId: string) {
    this.saleService.removeProduct(productId);
  }

  findCustomer() {
    this.clientService.getClientId(this.phoneOrEmail).pipe(
    takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Success',
          html: 
            `<strong>Cliente:</strong> ${response.name} <br>
            <strong>Visitas:</strong> ${response.purchasesCount}`,          
          icon: 'success',
          confirmButtonText: 'ok',
        }).then((result)=>{
          if(result.isConfirmed){
            this.customerId = response._id;
            this.phoneOrEmail = response.name;
            console.log(`El client es: ${response.name}`)
          }
        });
      },
      error: (err) => {
        console.error('Error al buscar cliente:', err);
        Swal.fire('Error', 'No se encontró el cliente', 'error');
      }
    });
  }

  cancelCustomer(){
    this.customerId="";
    this.phoneOrEmail="";
    console.log(`El cliente se canceló, ahora es: ${this.customerId}`)
  };


  cancelSale() {
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
    Swal.fire({
      title: '¿Confirmar compra?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Volver'
    }).then((result) => {
      if (result.isConfirmed) {
        this.saleService.completeSale(this.customerId).subscribe({
          next: () => { 
            console.log(`Keep client: ${this.customerId}`)
            this.saleService.cancelSale();
            this.customerId = '';
            Swal.fire('Venta completada', 'Generando ticket', 'success');
            this.router.navigate(['/ticket']);
        },
        error: (err) => alert('Error al completar la venta: ' + err.message)
      });
      }
    });
  }

  calculateSubtotal(sale: Sale | null): number {
    return this.saleService.calculateSubtotal(sale);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}