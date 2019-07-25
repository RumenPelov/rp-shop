import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from "../_services/auth.service";
import { CartService } from "../_services/cart.service";


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  private subCart: Subscription;
  private subFetch: Subscription;
  opt: Number[]=Array.from(Array(26).keys()).slice(1);
  cart: any;
  emptyCart: boolean = false;

  constructor(private auth: AuthService,
              private router: Router,
              private cartServ:CartService) { }

  ngOnInit() {
    if(this.auth.loggedIn()) {
      const user = this.auth.getUser();
      this.fetchCart(user.username);
      window.scrollTo(0, 0);

    } else {
      if(!this.auth.loggedIn()) {
        this.cartServ.guestCartSession();
      }
    }
    
    this.subCart=this.cartServ.getCart()
          .subscribe(cart =>{
           // console.log(cart);
            this.cart=cart;
          }); 
    
  }

  fetchCart(username:String){
    this.subFetch=this.auth.getCart(username)
    .subscribe(
      data => {
        this.updateCart(data);
      },
      error => console.error("error")
    );
  }

  updateCart(data:any){
    var newCart={...data};

     // console.log(newCart);
    this.cartServ.setCart(newCart);
  }

  onChange(qty:any, itemId:any){
    if(this.auth.loggedIn()) {
      this.auth.updateCart(qty,itemId)
      .subscribe(
        data => {
          this.updateCart(data);
        },
        error => console.error("error")
      );
    } else {
      this.cartServ.guestCartUpdate(qty, itemId);
    }
  }

  openCheckout() {
    if(this.cart.items.length === 0) {
      this.emptyCart = true;
      return;
    }

    if (this.auth.loggedIn()){
      this.router.navigate([ 'user/' + this.auth.user.username+ '/cart/pay']);
    } else {
      this.router.navigate([ 'user/guest/cart/pay']);
    }
  }

  ngOnDestroy() {
    this.subCart.unsubscribe();
    if (this.subFetch){
      this.subFetch.unsubscribe();
    }
  }
}
