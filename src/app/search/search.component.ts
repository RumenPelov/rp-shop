import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from "../_services/auth.service";
import { ServerService } from "../_services/server.service";
import { CartService } from "../_services/cart.service";
import { Data } from "../_services/data";
import { Item} from "../_services/item-data";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private sub:any;
  private subAuth:any;
  private subServ:any;
  data: Data = new Data();
  pages: Number[];
  

  constructor(private serv: ServerService,
              private route: ActivatedRoute,
              private auth:AuthService,
              private cartServ:CartService) { }

  ngOnInit() {
    this.sub=this.route
    .queryParams
    .subscribe(params => {
      this.searchData(params['query'],params['page']);
    });
  }

  searchData(query?:String, page?:Number){
    let q:String = query ? query : "";
    let p:Number = page ? page : 0;
    
   this.subServ = this.serv.search(q,p)
    .subscribe(
      data => {
        this.data.queryString=data.queryString,
        this.data.itemCount=data.itemCount,
        this.data.pages=data.pages,
        this.data.page=data.page,
        this.data.items=data.items

       this.pages=Array.from(Array(this.data.pages).keys());
      },
      error => console.error("error")
    );
  }

  addToCart(item:Item){

    if (this.auth.loggedIn()){

     this.subAuth = this.auth.addToCart(this.auth.user.username, item._id.toString() )
      .subscribe(
        data => {
          var newCart={ ...data};
          this.cartServ.setCart(newCart);
        },
        error => console.error("error")
      );
    }else{
      this.cartServ.guestCartAddItem(item);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    if(this.subAuth){
      this.subAuth.unsubscribe();
    }
    if(this.subServ){
      this.subServ.unsubscribe();
    }
  }

}
