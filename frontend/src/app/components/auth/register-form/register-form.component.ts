import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { catchError, debounceTime, map, Observable, of, switchMap, timer } from 'rxjs';
import { FormFieldComponent } from '../../shared/form-field/form-field.component';
import { RouterLink } from "@angular/router";
import { ClientService } from '../../../core/services/client/client.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, RouterLink],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {

  fb = inject(FormBuilder);
  registerForm: FormGroup;
  isSubmited: boolean = false;

  fields = [
    {
      label: 'Nombre del cliente',
      fieldId: 'name',
      type: 'text',
      placeholder: 'Nombre',
      required: true, 
    },
    {
      label: 'Phone or Email',
      fieldId: 'phoneOrEmail',
      type: 'string',
      placeholder: 'example@example.com or +52-Number',
      required: true,
    },
  ];

  constructor(private authService: AuthService, private clientService:ClientService) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        phoneOrEmail: ['',[Validators.required],[this.phoneOrEmailValidator()]],
      },
    );
  }

phoneOrEmailValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    const value = control.value.trim();
    const emailRegex = /^\S+@\S+\.\S+$/;
    const phoneRegex = /^\+\d{10,15}$/;

    const isValidEmail = emailRegex.test(value);
    const isValidPhone = phoneRegex.test(value);

    if (!isValidEmail && !isValidPhone) {
      return of({ 
        invalidFormat: { 
          message: 'Debe ser un email válido o un teléfono con formato +1234567890' 
        } 
      });
    }
    console.log('Verificando:', value);
    return this.authService.checkClientExist(value).pipe(
      debounceTime(500),
      switchMap((exist) => {
        if (exist) {
          return of({ phoneOrEmailTaken: true });
        }
        return of(null);
      }),
      catchError(() => of({ cantFetch: true }))
    );
  };
}

  phoneValidator(): ValidatorFn {
    return (formControl: AbstractControl): ValidationErrors | null => {
      const phoneValue = formControl.value;
      console.log(phoneValue.length);
      console.log(Number.isNaN(+phoneValue));
      if (phoneValue.length !== 10 || Number.isNaN(+phoneValue)) {
        return { invalid_phone: true };
      }
      return null;
    };
  }

  emailAsycValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null);
      }
      console.log(control.value);
      return this.authService.checkEmailExist(control.value).pipe(
        debounceTime(500),
        switchMap((exist) => (exist ? of({ emailTaken: true }) : of(null))),
        catchError(() => of({ cantFetch: true }))
      );
    };
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control || !control.touched) {
      return '';
    }
    if (control.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control.hasError('email')) {
      return 'Email no valido';
    }
    if (control.hasError('emailTaken')) {
      return 'Este usuario ya existe';
    }
    if (control.hasError('cantFetch')) {
      return 'Error del servidor, intente en otro momento';
    }
    if (control.hasError('invalid_phone')) {
      return 'Telefono no valido';
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
      console.log(this.registerForm.value);
      this.clientService.createCustomer(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Cliente creado:', response);
          this.isSubmited = true;
          this.registerForm.reset();
        },
        error: (error) => {
          console.error('Error al crear cliente:', error);
        }
      });
    }
  }
}
