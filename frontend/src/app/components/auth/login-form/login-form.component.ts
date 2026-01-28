import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent{
  private fb = inject(FormBuilder);
  loginForm: FormGroup;
  isSubmited:boolean = false; 

  constructor(){
    this.loginForm = this.fb.group({
      email:['', [Validators.required, Validators.email]], 
      password:['', Validators.required]
    })
  }

  getErrorMessage(fieldName:string){
    const loginLabels = {
      email: 'email',
      password: 'contraseña'
    }
    return 
  }

  handleSubmit(){
    // console.log(this.loginForm.value);
    this.isSubmited = true;
  }
}
