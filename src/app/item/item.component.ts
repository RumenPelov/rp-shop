import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from "../_services/server.service";
import { AuthService } from "../_services/auth.service";
import { ItemData } from "../_services/item-data";
import { CartService } from "../_services/cart.service";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  data: ItemData= new ItemData();
  imgUrl: String ;
  private sub:any;

  constructor(private serv: ServerService,
              private route: ActivatedRoute,
              private router: Router,
              private auth:AuthService,
              private cartServ:CartService) { }

  ngOnInit() {
    this.sub= this.route
              .params
              .subscribe(params => {
                this.getItem(params['itemId']);

                window.scrollTo(0, 0);
              });
  }

  getItem(itemId:any){
    
    this.serv.getItem(itemId)
    .subscribe(
      data => {
        this.data = {...data }
        this.imgUrl="assets/" + data.item.img_url;
      },
      error => console.error("error")
    );
  }

  addToCart(itemId:any){

    if (this.auth.loggedIn()){

      this.auth.addToCart(this.auth.user.username,itemId )
      .subscribe(
        data => {
          var newCart={ ...data};
          this.cartServ.setCart(newCart);

          this.router.navigate([ 'user/cart']);
        },
        error => console.error("error")
      );
    }else{
      this.cartServ.guestCartAddItem(this.data.item);
      this.router.navigate([ 'user/cart']);
      //window.alert("Please log in to view cart");
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
