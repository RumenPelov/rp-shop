import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CartService } from "../../_services/cart.service";
import { AuthService } from "../../_services/auth.service";


@Component({
  selector: 'cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.css']
})
export class CartSummaryComponent implements OnInit {
  private subCart: Subscription;
  private subFetch: Subscription;

  shopingCart: any;

  constructor( private auth: AuthService,
               private cartServ:CartService) { }

  ngOnInit() {
    if (this.auth.loggedIn()) {
      if (!this.cartServ.fetched){
        const user = this.auth.getUser();
        this.fetchCart(user.username);
        window.scrollTo(0, 0);

      }
    }else {
      this.cartServ.guestCartSession();
    }
    
    this.subCart=this.cartServ.getCart()
          .subscribe(cart =>{
            this.shopingCart=cart;
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
    this.cartServ.setCart(newCart);
  }

  
  ngOnDestroy() {
    this.subCart.unsubscribe();
    if (this.subFetch){
      this.subFetch.unsubscribe();
    }
  }

}
