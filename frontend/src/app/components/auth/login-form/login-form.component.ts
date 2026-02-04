import { Component, inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorService } from '../../../core/services/validation/form-error.service';
import { Router, RouterLink } from '@angular/router';
import { canComponentDeactivate } from '../../../core/guards/form/form.guards';
import { catchError, debounceTime, map, Observable, of, switchMap, timer } from 'rxjs';
import { FormFieldComponent } from '../../shared/form-field/form-field.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserService } from '../../../core/services/user/user.service';


@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormFieldComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent implements canComponentDeactivate{
  private fb = inject(FormBuilder);
  loginForm: FormGroup;
  isSubmited:boolean = false; 

  constructor(private validation: FormErrorService, private router:Router, private authService:AuthService, private userService:UserService){
    this.loginForm = this.fb.group({
      email:['', [Validators.required, Validators.email],[this.emailAsycValidator()]], 
      password:['', Validators.required]
    })
  }
  
  canDeactivate() : Observable<boolean> | Promise<boolean> | boolean{
    if (this.loginForm.pristine || this.isSubmited) {
      return true;
    }
    return confirm('Tienes cambios sin guardar. \n ¿Estás seguro de que quieres salir?');
  };

  emailAsycValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null);
      }
      return timer(500).pipe(  // ← Espera ANTES de la petición
        switchMap(() => this.authService.checkEmailExist(control.value)),
        map((exist) => !exist ? { emailTaken: true } : null),
        catchError(() => of({ cantFetch: true }))
      );
    };
  }

  getErrorMessage(fieldName:string){
    const loginLabels = {
      email: 'email',
      password: 'contraseña'
    }
    return this.validation.getFieldError(this.loginForm, fieldName, loginLabels)
  }

  handleSubmit(){
    if (this.loginForm.valid) {
      this.userService.login(this.loginForm.value).subscribe({
        next: (response) => {          
          this.isSubmited = true;
          localStorage.setItem('token', response.token);
          this.userService.setSharedUser(response.user);
          this.loginForm.reset();
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error al iniciar sesión:', error);
        }
      });
    }
  }

}
