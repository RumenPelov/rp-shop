import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from "../_services/server.service";
import { AuthService } from "../_services/auth.service";
import { CartService } from "../_services/cart.service";
import { Data } from "../_services/data";
import { Item} from "../_services/item-data";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: []
})
export class HomeComponent implements OnInit {
  private sub:any;
  data: Data = new Data();
  pages: Number[];
  list: boolean = false;

  constructor(private serv: ServerService,
              private route: ActivatedRoute,
              private router: Router,
              private auth:AuthService,
              private cartServ:CartService) { }

  ngOnInit() {
    this.sub=this.route
              .queryParams
              .subscribe(params => {
                this.getData(params['category'],params['page']);
              });
  }

  getData(category?:String, page?:Number){
    let cat:String = category ? category:"All";
    let p:Number = page ? page : 0;
    this.serv.getData(cat,p)
    .subscribe(
      data => {
        this.data.category_param=data.category_param;
        this.data.categories=data.categories;
        this.data.itemCount=data.itemCount;
        this.data.pages=data.pages;
        this.data.page=data.page;
        this.data.items=data.items;
       
        this.pages=Array.from(Array(this.data.pages).keys());

        this.serv.updateCachedData(data);
      },
      error => console.error("error")
    );
  }

  addToCart(item:Item){

    if (this.auth.loggedIn()){

      this.auth.addToCart(this.auth.user.username, item._id.toString() )
      .subscribe(
        data => {
          var newCart={ ...data};
          this.cartServ.setCart(newCart);

          //this.router.navigate([ 'user/cart']);
        },
        error => console.error("error")
      );
    }else{
      this.cartServ.guestCartAddItem(item);
      //this.router.navigate([ 'user/cart']);
    }
  }

  toggleList= ()=>{
    this.list = !this.list;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


}
