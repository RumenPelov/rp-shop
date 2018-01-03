import { Component, OnInit, ElementRef, ViewChild,Output,EventEmitter } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

import { AuthService } from "../_services/auth.service";

import { Observable } from "rxjs";



class Signup {
  constructor (public username?: FormControl,
              public password?: FormControl,
              public verify?: FormControl,
              public email?: FormControl,
              public username_error?:string){
  }
}

class Login {
  constructor (public username?: FormControl,
               public password?: FormControl,
               public loginError: String=''){
  }
}


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: []
})
export class HeaderComponent implements OnInit {

//@Output() user = new EventEmitter<User>();

@ViewChild('openBtn') openBtn: ElementRef;
@ViewChild('closeLogin') closeLogin: any;
@ViewChild('closeSignup') closeSignup: any;

private myLoginform: FormGroup;
private mySignupform: FormGroup;
private Signup : Signup = new Signup();
private Login :Login = new Login();



  constructor(private auth:AuthService) {
  }

  ngOnInit() {
    this.auth.updateUser();
    this.createLoginForm();
    this.createSignupForm();
  }

  createSignupForm() {
    this.Signup.username= new FormControl('', [
      Validators.required,
      Validators.pattern("^[a-zA-Z0-9_-]{0,20}$"),
      Validators.minLength(3) ]);
    this.Signup.password= new FormControl('', [
      Validators.required,
      Validators.minLength(6)]);
    this.Signup.verify= new FormControl('', [
      Validators.required,
      Validators.minLength(6)]);
    this.Signup.email= new FormControl('', [
      Validators.pattern("[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}")]);
    
    this.mySignupform = new FormGroup({
      username: this.Signup.username,
      password: this.Signup.password,
      verify: this.Signup.verify,
      email: this.Signup.email
    });
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
      console.log("Form Submitted!");
      this.auth.validateLogin(this.Login.username.value, this.Login.password.value )
      .subscribe(
        data => {
          if(data.login_error){
            this.Login.password.reset();
            console.log(data);
            this.Login.loginError=data.login_error;
          }else{
            this.auth.setSession(data);
            this.myLoginform.reset();
            this.closeLogin.nativeElement.click();
          }
        },
        error =>{
          console.error(error);
          this.Login.password.reset();
          this.Login.loginError=error.login_error;
        } 
      );

    }
  }

  onSignupSubmit() {
    if (this.mySignupform.valid && this.validateVerify()) {
      console.log("Form mySignupform Submitted!");
      this.auth.addUser(this.Signup.username.value, 
                                     this.Signup.password.value,
                                     this.Signup.email.value )
      .subscribe(
        data => {
            this.auth.setSession(data);
            this.mySignupform.reset();
            this.closeSignup.nativeElement.click();
        },
        error => {
          console.error(error);
          this.mySignupform.reset();
          if(error.username_error){
            this.Signup.username_error=error.username_error;
          }
        }
      );
    }
  }

  openSignUpModal(){
    let self=this;
    setTimeout(function(){
      self.openBtn.nativeElement.click();}, 400);
  }

  logout(){
    this.auth.clearSession();     
  }

  validateVerify(){
    return this.Signup.verify.value==this.Signup.password.value;
  }


}

  