import { Component } from '@angular/core';
import { MenuComponent } from "../menu/menu.component";
import { ProductsComponent } from "../products/products.component";
import { SaleComponent } from '../sale/sale.component';

@Component({
  selector: 'app-main',
  standalone:true,
  imports: [MenuComponent, ProductsComponent, SaleComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
