import { Component, OnInit, Input } from '@angular/core';

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

  @Input() params : Array<object> ;
  
  constructor(public auth:AuthService,
              public cartServ:CartService) { }

  ngOnInit() {
  }

}
