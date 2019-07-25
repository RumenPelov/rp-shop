import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { CartService } from "../../_services/cart.service";

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  private _sameShippingAddress: boolean = false;
  private _billingFormValidated: boolean = false;
  private _shippingFormValidated: boolean = false;
  billingFormValues: any;
  shippingFormValues: any;
  @Output() addressSubmittted = new EventEmitter<boolean>();
  
  isSubmited : boolean = false;
  

  constructor( private cartServ:CartService) { }

  ngOnInit() {
    if(this.cartServ.cart.addresses) {
      this.billingFormValues = this.cartServ.cart.addresses.billing;
      this.shippingFormValues = this.cartServ.cart.addresses.shipping;
    }
  }

  checkBoxChecked(){
    this._sameShippingAddress = !this._sameShippingAddress;
  }

  onSubmit(){
    this.isSubmited = true;

    if((this._billingFormValidated && this._sameShippingAddress) || 
    (this._billingFormValidated && this._shippingFormValidated)) {
      if(this._sameShippingAddress){
        this.shippingFormValues = this.billingFormValues;
      } 
    this.cartServ.addCartAdresses(this.billingFormValues, this.shippingFormValues);
    this.addressSubmittted.emit(true);
    }

  }

  BillingFormValidate(event) {
    this._billingFormValidated = event;
  }
  BillingFormUpdate(values) {
    this.billingFormValues= values;
  }
  ShippingFormValidate(event) {
    this._shippingFormValidated = event;
  }
  ShippingFormUpdate(values) {
   this.shippingFormValues = values;
  }

}
