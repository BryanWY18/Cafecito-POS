import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../core/types/User';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../core/services/user/user.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';


@Component({
  selector: 'app-menu',
  standalone:true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{

  route = inject(ActivatedRoute);
  barista:string='';
  private destroy$ = new Subject<void>();

  downBarOpen: boolean = false;

  constructor(private router:Router,private userService:UserService, private authService:AuthService){}

  ngOnInit(): void {
    this.userService.selectedUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(userData => {
        if (userData) {
          this.barista = userData.displayName;
        }
      });
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
        this.authService.logOut();
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}