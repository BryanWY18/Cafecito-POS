import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user/user.service';
import { User } from '../../../core/types/User';
import { RouterLink } from "@angular/router";
import { FormFieldComponent } from "../../../components/shared/form-field/form-field.component";
import { FormBuilder, FormGroup, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { Observable, of, timer, switchMap, map, catchError, debounceTime } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, FormFieldComponent, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  fb = inject(FormBuilder);
  registerForm: FormGroup;
  isSubmited: boolean = false;

  fields = [
    {
      label: 'Nombre de usuario',
      fieldId: 'displayName',
      type: 'text',
      placeholder: 'Nombre',
      required: true, 
    },
    {
      label: 'Email',
      fieldId: 'email',
      type: 'email',
      placeholder: 'example@example.com',
      required: true,
    },
        {
      label: 'Contraseña',
      fieldId: 'password',
      type: 'password',
      placeholder: 'Contraseña',
      required: true,
    },
  ];

  allUsers:User[]=[];
  
  constructor(private authService: AuthService, private userService:UserService) {
    this.registerForm = this.fb.group(
      {
        displayName: ['', [Validators.required]],
        email: ['',[Validators.required, Validators.email],[this.emailAsycValidator()]],
        password:['',[Validators.required, Validators.minLength(6)]]
      },
    );
  }

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

  emailAsycValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null);
      }
      return this.authService.checkEmailExist(control.value).pipe(
        debounceTime(500),
        switchMap((exist) => (exist ? of({ emailTaken: true }) : of(null))),
        catchError(() => of({ cantFetch: true }))
      );
    };
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control || !control.touched || !control.errors) {
      return '';
    }
    if (control.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control.hasError('email')) {
      return 'Debe ser un emal válido';
    }
    if (control.hasError('emailTaken')) {
      return 'Este correo ya está registrado';
    }
    if(control.hasError('minlength')){
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (control.hasError('cantFetch')) {
      return 'Error de conexión con el servidor. Inténtalo más tarde.';
    }
    return '';
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.registerForm.pristine || this.isSubmited) {
      return true;
    }
    return confirm('Tienes cambios sin guardar.\n¿Estás seguro de que quieres salir?');
  }

  handleSubmit() {
    if (this.registerForm.valid) {
      this.userService.createUser(this.registerForm.value).subscribe({
        next: () => {
          this.isSubmited = true;
          this.registerForm.reset();
          alert('Usuario creado exitosamente');
          this.getUsers();
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
        }
      });
    }
  }

  deleteUser(id:string){
    Swal.fire({
      title: '¿Eliminar Usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
          next:()=>{
            Swal.fire('Usuario Eliminado');
            this.getUsers();
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
          }
        });
      }
    });
  }

}
