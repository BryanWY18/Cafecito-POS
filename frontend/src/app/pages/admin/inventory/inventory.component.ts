import { Component } from '@angular/core';
import { ProductsService } from '../../../core/services/products/products.service';
import { SaleService } from '../../../core/services/sale/sale.service';
import { ProductResponse } from '../../../core/types/Products';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})  
export class InventoryComponent {

    productResponse: ProductResponse = {
      products:[],
      pagination:{
        currentPage:1,
        hasNext:false,
        hasPrev:false,
        totalResults:0,
        totalPages:0,
      }
    };

    name:string = "";
    price:number=0;
    stock:number=0;
    
    constructor(private productService:ProductsService, private saleService:SaleService){}
    
    ngOnInit(): void {
      this.getProducts();
    }
  
    getProducts(page:number=1, limit:number=10){
      this.productService.getProducts(page,limit).subscribe({
        next:(data)=>{
          this.productResponse = {
            ...data,
            products: data.products.map(product => ({
              ...product,
              quantity: 0
            }))
          };
        },
        error:(error)=>{
          console.log(error);
        }
      })
    };
  
    getInitials(productName: string): string {
      if (!productName) return '';  
      const words = productName.trim().split(' ');
      if (words.length === 1) {
        //Una sola palabra, toma primeras 2-3 letras
        return productName.substring(0, 3).toUpperCase();
      }
      //Múltiples palabras, toma la primera letra de cada palabra (máximo 3)
      return words
        .slice(0, 3)
        .map(word => word[0])
        .join('')
        .toUpperCase();
    }

    createProduct(){
      this.productService.createProduct({
        name:this.name,
        price:this.price,
        stock:this.stock
      }).subscribe({
        next:()=>{
          alert('Producto creado exitosamente');
          this.name='';
          this.price=0;
          this.stock=0;
        },
        error:(error)=>{
          console.log('Status:', error.status);
          console.log('Error completo:', error.error);         
        }
      })
    }

    deleteProduct(id:string){
      this.productService.deleteProduct(id).subscribe({
        next:()=>{
          alert('Producto eliminado del invetario');
          this.getProducts();
        },
        error:(error)=>{
          console.log('Status:', error.status);
          console.log('Error completo:', error.error);         
        }
      })
    }

    reStock(id:string){
      Swal.fire({
          title: 'Actualizar Datos',
          html: `
            <input id="name" class="swal2-input" placeholder="Nombre del producto">
            <input id="price" type="number" class="swal2-input" placeholder="Precio">
            <input id="stock" type="number" class="swal2-input" placeholder="Stock">
          `,
          showCancelButton: true,
          confirmButtonText: 'Actualizar',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            return {
              name: (document.getElementById('name') as HTMLInputElement).value,
              price: (document.getElementById('price') as HTMLInputElement).value,
              stock: (document.getElementById('stock') as HTMLInputElement).value
            };
          }
        }).then((result) => {
          if (result.isConfirmed) {
            const product = result.value;
            this.productService.updateProduct(id, product).subscribe({
              next:()=>{
                Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
                this.getProducts();
              }
            })
        }
      });
    }

}
