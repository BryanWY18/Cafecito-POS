import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Sale } from '../../core/types/Sale';
import { SaleService } from '../../core/services/sale/sale.service';
import { Observable, of } from 'rxjs';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-ticket',
  standalone:true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent implements OnInit{

  ticketData: Sale | null = null;

  constructor(private saleService:SaleService){}

  ngOnInit(): void {
    this.saleService.ticketResult$.subscribe(data=>{
      this.ticketData= data;
    })
  }

}
