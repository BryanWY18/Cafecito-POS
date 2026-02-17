import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { InventoryComponent } from "./inventory/inventory.component";
import { UsersComponent } from './users/users.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, InventoryComponent, UsersComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
