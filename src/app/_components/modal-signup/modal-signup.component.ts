import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from "../../_services/auth.service";
import { CartService } from "../../_services/cart.service";

class Signup {
  constructor (public username?: FormControl,
              public password?: FormControl,
              public verify?: FormControl,
              public email?: FormControl,
              public username_error?:string){
  }
}

@Component({
  selector: 'modal-signup',
  templateUrl: './modal-signup.component.html',
  styleUrls: ['./modal-signup.component.css']
})
export class ModalSignupComponent implements OnInit {
  private subCart: Subscription;
  @ViewChild('closeSignup') closeSignup: any;
  mySignupform: FormGroup;
  Signup : Signup = new Signup();

  constructor(private auth:AuthService,
              private cartServ:CartService) { }

  ngOnInit() {
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

  onSignupSubmit() {
    if (this.mySignupform.valid && this.validateVerify()) {
      //console.log("Form mySignupform Submitted!");
      this.auth.addUser(this.Signup.username.value, 
                                     this.Signup.password.value,
                                     this.Signup.email.value )
      .subscribe(
        data => {
            this.auth.setSession(data);
            this.mergeCarts();
            this.mySignupform.reset();
            this.closeSignup.nativeElement.click();
        },
        error => {
          //console.error(error.error);
          this.mySignupform.reset();
          if(error.error.username_error){
            this.Signup.username_error=error.error.username_error;
          }
        }
      );
    }
  }

  mergeCarts(){
    this.subCart = this.auth.onLoginResolveUserGuestCarts()
        .subscribe(
          data => {
            this.cartServ.setCart(data);
          },
          error => console.error("error")
        );
  }

  validateVerify(){
    return this.Signup.verify.value==this.Signup.password.value;
  }

  ngOnDestroy() {
    this.subCart.unsubscribe();
  }
}
