import { Injectable,EventEmitter } from '@angular/core';
import { Http, Response, Headers,RequestOptions  } from "@angular/http";
import { Observable } from "rxjs";
import 'rxjs/Rx';


@Injectable()
export class ServerService {
  private Url: String="https://rp-shop.herokuapp.com";
  //private Url: String="http://localhost:5000";

  constructor(private http: Http) { }

  setOptions(){
    const headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, withCredentials: true});
    
    return options;
  }

  getData(category:String, page:Number){
   
    let query = this.Url+`/main?page=${page}&category=`+category;
    return this.http.get(query, this.setOptions())
    .map((response: Response) => {
      return response.json();
    })
    .catch((error: any) => Observable.throw(error.json()));
  }

  search(item:String, page:Number){
    
    let query = this.Url+`/main/search?page=${page}&query=`+item;
    return this.http.get(query, this.setOptions())
    .map((response: Response) => {
      return response.json();
    })
    .catch((error: Response) => Observable.throw(error.json()));
  }

  getItem(itemId:Number){
   
    let query = this.Url+`/item/${itemId}`;
    return this.http.get(query, this.setOptions())
    .map((response: Response) => {
      return response.json();
    })
    .catch((error: Response) => Observable.throw(error.json()));
  }

  postReview(review:String, name:String, stars:String, itemId:Number){
    const body={"review":review, "name":name, "stars":stars };

    return this.http.post(this.Url+`/item/${itemId}/reviews`, body, this.setOptions())
    .map((response: Response) => {
      return response.json();
    })
    .catch((error: Response) => Observable.throw(error.json()));
  }

  

}
