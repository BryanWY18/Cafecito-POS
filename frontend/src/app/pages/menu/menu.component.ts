import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../core/types/User';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-menu',
  standalone:true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{

  user: User | null=null;
  route = inject(ActivatedRoute);

  downBarOpen: boolean = false;

  constructor(private router:Router){}

  ngOnInit(): void {
    this.route.data.subscribe(data=>{
      console.log(data['user']);
      this.user=data['user'];
    })
  }

  logout(){
    Swal.fire({
      title: '¿Cerrar Sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Cerrando Sesión', 'success');
        this.router.navigate(['/']);
      }
    });
  }

}