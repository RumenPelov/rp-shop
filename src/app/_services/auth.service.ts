import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from "@angular/core";
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { JwtHelperService } from '@auth0/angular-jwt';
import { CartService } from "./cart.service";

class User{
  constructor(public username: String,
              public email?:String){}
}

@Injectable()
export class AuthService {
  private jwtHelper: JwtHelperService = new JwtHelperService();
  //private Url: String="https://rp-shop.herokuapp.com/api";
  private Url: String="http://localhost:5000/api";
  public user: User;
  
  constructor(private http: HttpClient,
              private cartServ:CartService) {
    this.user=new User("");
   }

   getUser() {
    return this.user;
  }

   setOptions(){
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    let options = {headers: headers, withCredentials: true};
    
    return options;
  }

  jwt() {
    let token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    if (token){
      headers = headers.append('Authorization', 'Bearer ' + token );
    }
    let options = {headers: headers, withCredentials: true };

    return options;
  }

  validateLogin(username:String, password:String) : Observable<any>{
    var obj={username:username, password:password };
    const body=JSON.stringify(obj);

    return this.http.post(this.Url+'/auth/Login', body, this.setOptions())
    .pipe(
      catchError((error) => Observable.throw(error) )
    )

  }

  addUser(username:String, password:String, email:String) : Observable<any>{
    const body={"username":username, "password":password, "email":email };

    return this.http.post(this.Url+'/auth/signup', body,  this.setOptions())
    .pipe(
      catchError((error) => Observable.throw(error) )
    )
  }

  getCart(userId:String): Observable<any>{
    
    return this.http.get(this.Url+`/user/${userId}/cart`, this.jwt())
    .pipe(
      catchError((error) => Observable.throw(error) )
    )
  }

  //Resolve current guest cart and saved user cart on loggin in. 
  onLoginResolveUserGuestCarts() {
    const cart = this.cartServ.getSessionCartItem();
    if(cart) {
      const body = {cart}
      return this.http.put(this.Url+`/user/${this.user.username}/cart/update`,body, this.jwt())
        .pipe(
          catchError((error) => Observable.throw(error) )
        )
    } 
//console.log(this.getCart(this.user.username));
    return this.getCart(this.user.username);
  }

  updateCart(quantity:Number, itemId:any): Observable<any>{
    const body={"quantity":quantity};
    return this.http.post(this.Url+`/user/${this.user.username}/cart/${itemId}/quantity`,body, this.jwt())
    .pipe(
      catchError((error) => Observable.throw(error) )
    )
  }

  addToCart(userId:String, itemId:string): Observable<any> {
    const body={};
    return this.http.post(this.Url+`/user/${this.user.username}/cart/items/${itemId}`,body, this.jwt())
    .pipe(
      catchError((error) => Observable.throw(error) )
    );
  }

  billing(token: any, amount: number, name: string, email: string, address: object, cart: any) {
    const body =  {token, amount, name, email, address, items: cart.items};
    const user = this.user.username ? this.user.username : "guest";
    return this.http.post(this.Url+`/user/${user}/billing`,body, this.jwt())
    .pipe(
      catchError((error) => Observable.throw(error) )
    );
  }

  setSession(data){
    sessionStorage.setItem("token", data.token );
    this.updateUser();
  }

  clearSession(){
    sessionStorage.removeItem('token');
    this.updateUser();
  }

  loggedIn() {
    var token = sessionStorage.getItem('token');
    if (token){
      return !this.jwtHelper.isTokenExpired(token);
    }else{
      return false;
    }
  }

  updateUser(){
    var token = sessionStorage.getItem('token');
    if( token  &&  !this.jwtHelper.isTokenExpired(token) ){

      this.user['username']= this.jwtHelper.decodeToken(token)['username'];
      if(token['email']){
        this.user['email']=this.jwtHelper.decodeToken(token)['email'];
      }

    }else if(token  && this.jwtHelper.isTokenExpired(token)){
       sessionStorage.removeItem('token');
       //this.cartServ.resetCart();
    }
    if(!token){
      this.user['username']='';
      this.user['email']=null;
      //this.cartServ.resetCart();
    }

    this.checkExp();
  }

  useJwtHelper() {
    var token = sessionStorage.getItem('token');
  
    console.log(
      this.jwtHelper.decodeToken(token),
      this.jwtHelper.getTokenExpirationDate(token),
      this.jwtHelper.isTokenExpired(token)
    );
  }

  checkExp(){
    var token = sessionStorage.getItem('token');
    if(token){
      var exptime = this.jwtHelper.decodeToken(token)['exp'];
      var currtime = Math.floor(Date.now() / 1000);
    }
  }
}
