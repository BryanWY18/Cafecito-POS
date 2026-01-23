import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { ProductResponse } from '../../core/types/Products'
import { CurrencyPipe } from '@angular/common';
import { SaleService } from '../../core/services/sale/sale.service';

@Component({
  selector: 'app-products',
  standalone:true,
  imports: [CurrencyPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

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

  addToSale(product:any) {
    this.saleService.addProductToSale(product);
  }

}
