import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user/user.service';
import { User } from '../../../core/types/User';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  allUsers:User[]=[];

  constructor(private userService:UserService){}

  ngOnInit(): void {
    this.getUsers();
  }
  
  getUsers():void{
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.allUsers = data;
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }

}
