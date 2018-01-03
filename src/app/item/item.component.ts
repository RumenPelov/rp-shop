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
  private sub:any;
  private sixStars: any=Array.from(Array(5).keys());
  @ViewChild('f') form: any;
  private model;

  constructor(private serv: ServerService,
              private route: ActivatedRoute,
              private router: Router,
              private auth:AuthService,
              private cartServ:CartService) {
                this.model = {
                  stars: 5,
                  name:"",
                  review:""
              };
               }

  ngOnInit() {
    this.sub=this.route
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
        this.data.item=data.item,
        this.data.stars=data.stars,
        this.data.reviews=data.reviews,
        this.data.numReviews=data.numReviews,
        this.data.relatedItems=data.relatedItems
      },
      error => console.error("error")
    );
  }

  onSubmit(){
    if (this.form.valid) {
      console.log("Form Submitted!");
      this.serv.postReview(this.model.review, this.model.name,this.model.stars, this.data.item._id )
      .subscribe(
        data => {
          this.model.name='';
          this.model.review='';
          this.model.stars=5;

          this.getItem(data.itemId);
          window.scrollTo(0, 0);
        },
        error => console.error("error")
      );
    }
  }

  addToCart(itemId:any){

    if (this.auth.loggedIn()){

      this.auth.addToCart(this.auth.user.username,itemId )
      .subscribe(
        data => {
          var newCart={
            username: data.username, 
            updated: data.updated,
            cart: data.cart,
            total: data.total
          }
        this.cartServ.setCart(newCart);

          this.router.navigate([ 'user/'+data.username+'/cart']);
        },
        error => console.error("error")
      );
    }else{
      window.alert("Please log in to view cart");
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
