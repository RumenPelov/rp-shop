export class Cart {
public username: String ; 
public updated: boolean;
public cart: any;
public total: Number;
    constructor(){    
    }
}

export const InitialCart = {
    username: '', 
    updated: false,
    cart: {},
    total: 0
  }
