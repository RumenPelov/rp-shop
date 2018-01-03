
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Cart, InitialCart } from './cart';

@Injectable()
export class CartService {
  cart = InitialCart;
  cart$ = new BehaviorSubject<Cart>(this.cart);


  setCart(cart) {
    this.cart=cart;
    this.updateCartSbj(this.cart);
  }

  getCart(): Cart {
    return this.cart;
  }

  resetCart(){
    this.cart= InitialCart;
    this.updateCartSbj(this.cart);
  }

  private updateCartSbj(cart) {
    this.cart$.next(cart);
  }

}