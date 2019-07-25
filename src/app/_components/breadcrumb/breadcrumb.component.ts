import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from "../../_services/auth.service";
import { CartService } from "../../_services/cart.service";

class Params {
  constructor (public route?: string,
               public query?: object,
               public text?: string ){
  }
}

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  private subCart: Subscription;
  @Input() params : Array<object> ;
  total: number;
  
  constructor(public auth:AuthService,
              public cartServ:CartService) { }

  ngOnInit() {
    this.subCart=this.cartServ.getCart()
    .subscribe(cart =>{
      this.total=cart.total;
    }); 
  }

  ngOnDestroy() {
    this.subCart.unsubscribe();
  }
}
