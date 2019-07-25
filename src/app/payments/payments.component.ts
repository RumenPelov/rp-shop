import { Component, OnInit, 
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
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

  import { CartService } from "../_services/cart.service";
  import { AuthService } from "../_services/auth.service";
import { concatAll } from 'rxjs-compat/operator/concatAll';
  class PayDetails {
    constructor (public name?: FormControl,
                public email?: FormControl){
    }
  }

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  private subCart: Subscription;
  addressSubmitted : boolean = false;
  payAttempted : boolean = false;
  paymentConfirmed : boolean = false;
  confirmationData : any = {"_id":1558220225,"date":"2019-5-18 18:57:04","charge":"ch_1EbbSfIzXoHaPFf9vVQCw8XA","address":{"billing":{"firstName":"Rumen","address":"35-415 River Oaks Blvd W","zip":"L6H5P7","lastName":"Pelov","country":"United States","state":"California"},"shipping":{"firstName":"Rumen","address":"35-415 River Oaks Blvd W","zip":"L6H5P7","lastName":"Pelov","country":"United States","state":"California"}},"email":"ivanela1@abv.bg","amount":136.47,"name":"Rumen Pelov","user":"rumen","items":[{"_id":2,"title":"Coffee Mug","slogan":"Keep your coffee hot!","description":"A mug is a type of cup used for drinking hot beverages, such as coffee, tea, hot chocolate or soup. Mugs usually have handles, and hold a larger amount of fluid than other types of cup. Usually a mug holds approximately 12 US fluid ounces (350 ml) of liquid; double a tea cup. A mug is a less formal style of drink container and is not usually used in formal place settings, where a teacup or coffee cup is preferred.","stars":0,"category":"Kitchen","img_url":"/img/products/mug.jpg","price":12.5,"reviews":[{"name":"","comment":"","stars":5,"date":1456067725049},{"name":"John","comment":"Nice!","stars":3,"date":1557440160301},{"name":"Peter","comment":"Very nice!","stars":3,"date":1557440768063}],"quantity":3},{"_id":7,"title":"Brown Tumbler","slogan":"Bring your coffee to go","description":"The MongoDB Insulated Travel Tumbler is smartly designed to maintain temperatures and go anywhere. Dual wall construction will keep your beverages hot or cold for hours and a slide lock lid helps minimize spills.","stars":0,"category":"Kitchen","img_url":"/img/products/brown-tumbler.jpg","price":9,"quantity":1},{"_id":1,"title":"Gray Hooded Sweatshirt","slogan":"The top hooded sweatshirt we offer","description":"Unless you live in a nudist colony, there are moments when the chill you feel demands that you put on something warm, and for those times, there's nothing better than this sharp MongoDB hoodie. Made of 100% cotton, this machine washable, mid-weight hoodie is all you need to stay comfortable when the temperature drops. And, since being able to keep your vital stuff with you is important, the hoodie features two roomy kangaroo pockets to ensure nothing you need ever gets lost.","stars":0,"category":"Apparel","img_url":"/img/products/hoodie.jpg","price":29.99,"quantity":3}]}

  @ViewChild('cardInfo') cardInfo: ElementRef;
  addresses: any;
  error: string;
  sameShippingAddress: boolean = false;
  payDetailsForm: FormGroup;
  payDetails : PayDetails = new PayDetails();

  constructor(private cd: ChangeDetectorRef,
              private cartServ:CartService,
              private  auth:AuthService) {}

  ngOnInit() {
  }

  checkBoxChecked(){
    this.sameShippingAddress = !this.sameShippingAddress;
  }

  onAddressSubmit(event){
    this.addressSubmitted = event;
    if (event) {
      this.subCart=this.cartServ.cart$
      .subscribe(cart =>{
          this.addresses= cart.addresses;
      });
    }
  }

  onPaymentSubmit(pay){
    this.confirmationData= pay.data;
    this.paymentConfirmed = pay.confirmed;
    this.cartServ.resetCart();
  }

  ngOnDestroy() {
    if(this.subCart){
      this.subCart.unsubscribe;
    }
  }
}
