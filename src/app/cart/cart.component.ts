import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from "../_services/auth.service";
import { CartService } from "../_services/cart.service";


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  private cart: any;
  private subRout: Subscription;
  private subCart: Subscription;
  private opt: Number[]=Array.from(Array(26).keys()).slice(1);

  constructor(private auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private cartServ:CartService) { 
  
              }

  ngOnInit() {
    this.subRout=this.route
    .params
    .subscribe(params => {
      this.getCart(params['userId']);

      window.scrollTo(0, 0);
    });

    this.subCart=this.cartServ.cart$
    .subscribe(cart =>{
        this.cart=cart;
    });
  }

  getCart(username:String){
    this.auth.getCart(username)
    .subscribe(
      data => {
        this.updateCart(data);
      },
      error => console.error("error")
    );
  }

  onChange(qty:any, itemId:any){
    this.auth.updateCart(qty,itemId)
    .subscribe(
      data => {
        this.updateCart(data);
      },
      error => console.error("error")
    );
  }

  updateCart(data:any){
    var newCart={
      username: data.username, 
      updated: data.updated,
      cart: data.cart,
      total: data.total
    }
  this.cartServ.setCart(newCart);
  }

  ngOnDestroy() {
    this.subRout.unsubscribe();
    this.subCart.unsubscribe();
  }

}
