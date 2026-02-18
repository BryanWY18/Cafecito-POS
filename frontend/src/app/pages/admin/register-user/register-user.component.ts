import { Component, OnInit } from '@angular/core';
import { Client, ClientResponse } from '../../../core/types/Client';
import { ClientService } from '../../../core/services/client/client.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-user',
  standalone:true,
  imports: [RouterLink],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent implements OnInit{

  allClients:Client[]=[];
  currentPage: number = 1;
  totalPages: number = 1;
  hasNext: boolean = false;
  hasPrev: boolean = false;
  
  constructor(private authService: AuthService, private clientService:ClientService) {}

  ngOnInit(): void {
    this.getClients();
  }
  
  getClients(page: number = 1): void {
    this.clientService.getCustomers(page).subscribe({
      next: (response: ClientResponse) => {
        this.allClients = response.clients;
        this.currentPage = response.pagination.currentPage;
        this.totalPages = response.pagination.totalPages;
        this.hasNext = response.pagination.hasNext;
        this.hasPrev = response.pagination.hasPrev;
      }
    });
  } 

  nextPage(): void {
  if (this.hasNext) {
    this.getClients(this.currentPage + 1);
  }
  }

  prevPage(): void {
    if (this.hasPrev) {
      this.getClients(this.currentPage - 1);
    }
  }

  goToPage(page: number): void {
    this.getClients(page);
  }

}
