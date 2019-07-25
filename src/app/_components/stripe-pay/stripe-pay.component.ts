import { Component, 
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  ChangeDetectorRef } from '@angular/core';
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

class PayDetails {
  constructor ( public name?: FormControl,
                public email?: FormControl){
  }
}

@Component({
  selector: 'stripe-pay',
  templateUrl: './stripe-pay.component.html',
  styleUrls: ['./stripe-pay.component.css']
})
export class StripePayComponent implements OnInit {
  private subCart: Subscription;
  private subPayment: Subscription;

  @ViewChild('cardInfo') cardInfo: ElementRef;
  @Input() addressSubmitted : boolean = false;
  @Output('data') confirmationData = new EventEmitter<any>();
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  transferError: boolean= false;
  payDetailsForm: FormGroup;
  payDetails : PayDetails = new PayDetails();
  payAttempted : boolean = false;
  inProgress: boolean = false;

  constructor(private cd: ChangeDetectorRef,
              private cartServ:CartService,
              private auth:AuthService) {}

  ngOnInit() {
    this.createPayForm();
  }
  
  createPayForm() {
    this.payDetails.name= new FormControl('', [
      Validators.required,
      Validators.minLength(3) ]);
    this.payDetails.email= new FormControl('', [
      Validators.required,
      Validators.pattern("[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}")]);
    
    this.payDetailsForm = new FormGroup({
      name:  this.payDetails.name,
      email: this.payDetails.email
    });
  }

  ngAfterViewInit() {
    var style = {
      base: {
        color: '#303238',
        fontSize: '16px',
        fontFamily: '"Open Sans", sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#CFD7DF',
        },
      },
      invalid: {
        color: '#e5424d',
        ':focus': {
          color: '#303238',
        },
      },
    };

    this.card =(<any>window).elements.create('card', { style });
    this.card.mount(this.cardInfo.nativeElement);

    this.card.addEventListener('change', this.cardHandler);
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async onSubmit() {
    if(this.payDetailsForm.valid && this.addressSubmitted){
      this.inProgress = true;

      const { token, error } = await (<any>window).stripe.createToken(this.card);

      if (error) {
        console.log('Something is wrong:', error);
        this.transferError = true;
      } else {
        //console.log('Success!', token);
        // ...send the token to the backend to process the charge
        let name = this.payDetails.name.value,
            email = this.payDetails.email.value,
            amount = this.cartServ.cart.total,
            cart = this.cartServ.cart,
            addresses = this.cartServ.cart.addresses;
        this.subPayment = this.auth.billing(token, amount, name, email, addresses, cart)
                .subscribe(payed => {
               // console.log("payed:", payed);
    
                this.onPayConfirmed(payed);
                },
                error => {
                  console.log("error")
                  this.transferError = true;
                });
              
      }
    } else {
      this.payAttempted = true;
    }
  }

  onPayConfirmed(data) {
    let confirmation = {
      data,
      confirmed: true
    }
    this.confirmationData.emit(confirmation);
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
    if(this.subCart){
      this.subCart.unsubscribe;
    }
    if(this.subPayment) {
      this.subPayment.unsubscribe;
    }
  }

}
