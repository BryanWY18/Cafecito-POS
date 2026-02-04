import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorService } from '../../../core/services/validation/form-error.service';
import { Router, RouterLink } from '@angular/router';
import { canComponentDeactivate } from '../../../core/guards/form/form.guards';
import { Observable } from 'rxjs';
import { FormFieldComponent } from '../../shared/form-field/form-field.component';


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

  constructor(private validation: FormErrorService, private router:Router){
    this.loginForm = this.fb.group({
      email:['', [Validators.required, Validators.email]], 
      password:['', Validators.required]
    })
  }
  
  canDeactivate() : Observable<boolean> | Promise<boolean> | boolean{
    if (this.loginForm.pristine || this.isSubmited) {
      return true;
    }
    return confirm('Tienes cambios sin guardar. \n ¿Estás seguro de que quieres salir?');
  };

  getErrorMessage(fieldName:string){
    const loginLabels = {
      email: 'email',
      password: 'contraseña'
    }
    return this.validation.getFieldError(this.loginForm, fieldName, loginLabels)
  }

  handleSubmit(){
    console.log(this.loginForm.value);
    // this.authService.login(this.loginForm.value);
    //this.store.dispatch(login({credentials:this.loginForm.value}))
    this.isSubmited = true;
  }
}
