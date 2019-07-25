
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, InitialCart } from './cart';


@Injectable()
export class CartService {
  cart = InitialCart;
  fetched : boolean = false;
  cart$ = new BehaviorSubject<Cart>( InitialCart);

  setCart(cart) {
    this.fetched = true;
    this.updateCartSbj(cart);
    this.updateSessionStorage(cart);
  }
  //called from cart component
  getCart(): Observable<Cart> {
    return this.cart$;
  }
  //called from address component
  addCartAdresses(billig, shipping){
    let cart = this.getSessionCartItem();
      cart['addresses'] = {
        billing : {...billig},
        shipping : {...shipping}
      };
      this.cart = cart;
    this.updateSessionStorage(cart);
    this.updateCartSbj(cart);
  }

  resetCart(){
    this.cart= InitialCart;
    this.updateSessionStorage(InitialCart);
    this.updateCartSbj(InitialCart);
    this.fetched = false;
  }

  private updateCartSbj(cart) {
    this.cart=cart;
    this.cart$.next(cart);
  }

  //Guest cart methods

  guestCartSession(){
    const cart = sessionStorage.getItem("cart");
    if (cart) {
      this.updateCartSbj(JSON.parse(cart));
    } else {
      this.updateSessionStorage(InitialCart);
    }
  }

  guestCartAddItem(item) {
    let cart = sessionStorage.getItem("cart");
    let newCart;
    if(cart) {
      newCart = JSON.parse(cart);
    } else {
      newCart = InitialCart;
    }
    newCart = this.updateGuestCartItem(newCart, item);
    newCart.total =this.cartTotal(newCart);
    this.updateCartSbj(newCart);
    this.updateSessionStorage(newCart)
  }

  guestCartUpdate(qty:any, itemId:any){
    qty = parseInt(qty);
    let cart = JSON.parse(sessionStorage.getItem("cart"));
    if(qty == 0){
      cart.items = cart.items.filter(item => item._id !== itemId);
    } else if(qty > 0) {
      for (let item of cart.items ){
        if(item._id === itemId) {
          item.quantity = qty;
          break;
        }
      }
    }
    
    cart.total = this.cartTotal(cart);
    this.updateSessionStorage(cart);
    this.updateCartSbj(cart);
  }

  getSessionCartItem() {
    const cart = JSON.parse(sessionStorage.getItem("cart"));
    if(cart) {
      if(cart.items && cart.items.length > 0){
        return cart;
      }
    }
    return null;
  }

  private updateSessionStorage(cart) {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }

  private cartTotal(cart) {
    "use strict";
    var total = 0;
    for (var i=0; i<cart.items.length; i++) {
        var item = cart.items[i];
        total += item.price * item.quantity;
    }
    return total;
  }

  private updateGuestCartItem(cart, newItem) {
    newItem.quantity = 1;
    if(cart.items.length===0) {
      cart.items.push(newItem);
    } else {
      let isItem=false;
      for (let item of cart.items ){
        if(item._id === newItem._id){
          isItem = true;
          item.quantity = item.quantity + 1;
          break;
        }
      }
      if(!isItem) {
        cart.items.push(newItem);
      }
    }

    return cart;
  }
}