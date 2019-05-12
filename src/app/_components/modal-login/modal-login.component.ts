import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

import { AuthService } from "../../_services/auth.service";

class Login {
  constructor (public username?: FormControl,
               public password?: FormControl,
               public loginError: String=''){
  }
}

@Component({
  selector: 'modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.css']
})
export class ModalLoginComponent implements OnInit {

  @ViewChild('closeLogin') closeLogin: any;
  myLoginform: FormGroup;
  Login :Login = new Login();

  constructor(private auth:AuthService) { }

  ngOnInit() {
    this.createLoginForm();
  }

  createLoginForm() {
    this.Login.username= new FormControl('', [Validators.required,
                         Validators.pattern("^[a-zA-Z0-9_-]{3,20}$")]);
    this.Login.password= new FormControl('', [Validators.required,
                                              Validators.minLength(4)]);
    this.myLoginform = new FormGroup({
      username: this.Login.username,
      password: this.Login.password
    });
  }

  onLoginSubmit() {
    if (this.myLoginform.valid) {
      //console.log("Form Submitted!");
      this.auth.validateLogin(this.Login.username.value, this.Login.password.value )
      .subscribe(
        data => {
            //console.log(data);
            this.auth.setSession(data);
            this.myLoginform.reset();
            this.closeLogin.nativeElement.click();
        },
        error =>{
          //console.error(error.error);
          this.Login.password.reset();
          this.Login.loginError=error.error.login_error;
        } 
      );
    }
  }
}
