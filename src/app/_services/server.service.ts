import { Injectable,EventEmitter } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from "rxjs";

import { Data } from "../_services/data";



@Injectable()
export class ServerService {
  //private Url: String="https://rp-shop.herokuapp.com/api";
  private Url: String="http://localhost:5000/api";
  private data: Data = new Data();

  constructor(private http: HttpClient) { };

  setOptions(){
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    let options = {headers: headers, withCredentials: true};
    
    return options;
  }

  getCachedData(): Observable<any> {
    return new Observable(observer => observer.next(this.data) );
  }

  updateCachedData(data) {
    this.data.category_param=data.category_param;
    this.data.categories=data.categories;
    this.data.itemCount=data.itemCount;
    this.data.pages=data.pages;
    this.data.page=data.page;
    this.data.items=data.items;
    //console.log(this.data);
  }

  getData(category:String, page:Number) : Observable<any> {
 
    if(category === this.data.category_param && page === this.data.page){
      return this.getCachedData();
    }
   
    let query = this.Url+`/main?page=${page}&category=`+category;
    return this.http.get(query, this.setOptions())
    .pipe(
      catchError((error) => Observable.throw(error.json() ))
    )
  }

  search(item:String, page:Number): Observable<any>{
    
    let query = this.Url+`/main/search?page=${page}&query=`+item;
    return this.http.get(query, this.setOptions())
    .pipe(
      catchError((error) => Observable.throw(error.json() ))
    )
  }


  getItem(itemId:Number) : Observable<any>{
      
    let query = this.Url+`/item/${itemId}`;
    return this.http.get(query, this.setOptions())
    .pipe(
      catchError((error) => Observable.throw(error.json() ))
    )
  }

  postReview(review:String, name:String, stars:String, itemId:Number) : Observable<any> {
    const body={"review":review, "name":name, "stars":stars };

    return this.http.post(this.Url+`/item/${itemId}/reviews`, body, this.setOptions())
    .pipe(
      catchError((error) => Observable.throw(error.json() ))
    )
  }

}
