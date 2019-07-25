export class Cart {
public username: string ; 
public updated: boolean;
public items: any;
public total: number;
public addresses: any ; 
    constructor(){    
    }
}

export const InitialCart = {
    username: '', 
    updated: false,
    items: [],
    total: 0,
    addresses:null
  }
