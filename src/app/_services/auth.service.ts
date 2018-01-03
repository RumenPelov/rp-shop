import { Http, Response, Headers,RequestOptions  } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { JwtHelper } from 'angular2-jwt';
import { CartService } from "./cart.service";


class User{
  constructor(public username: String,
              public email?:String){}
}

@Injectable()
export class AuthService {
  private jwtHelper: JwtHelper = new JwtHelper();
  private Url: String="https://rp-shop.herokuapp.com";
 // private Url: String="http://localhost:5000";
  public user: User;
  //public cart: Cart;

  constructor(private http: Http,
              private cartServ:CartService) {
    this.user=new User("");
    //this.cart=new Cart();
   }

   setOptions(){
    const headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, withCredentials: true});
    
    return options;
  }

  jwt() {
    let token = sessionStorage.getItem('token');
    const headers = new Headers({'Content-Type': 'application/json'});
    if (token){
      headers.append('Authorization', 'Bearer ' +token );
    }
    let options = new RequestOptions({headers: headers, withCredentials: true });

    return options;
  }


  validateLogin(username:String, password:String){
    var obj={username:username, password:password };
    const body=JSON.stringify(obj);

    return this.http.post(this.Url+'/auth/Login', body, this.setOptions())
    .map((response: Response) => {
      return response.json();
    })
    .catch((error: Response) => Observable.throw(error.json()));
  }

  addUser(username:String, password:String, email:String){
    const body={"username":username, "password":password, "email":email };

    return this.http.post(this.Url+'/auth/signup', body,  this.setOptions())
    .map((response: Response) => {
      return response.json();
    })
    .catch((error: Response) => Observable.throw(error.json()));
  }


  getCart(userId:String){
    
    return this.http.get(this.Url+`/user/${userId}/cart`, this.jwt())
    .map((response: Response) => {
      return response.json();
    })
    .catch((error: Response) => Observable.throw(error.json()));
  }

  updateCart(quantity:Number, itemId:any){
    const body={"quantity":quantity};
    return this.http.post(this.Url+`/user/${this.user.username}/cart/${itemId}/quantity`,body, this.jwt())
    .map((response: Response) => {
      return response.json();
    })
    .catch((error: Response) => Observable.throw(error.json()));
  }

  addToCart(userId:String, itemId:string){
    const body={};
    return this.http.post(this.Url+`/user/${this.user.username}/cart/items/${itemId}`,body, this.jwt())
    .map((response: Response) => {
      return response.json();
    })
    .catch((error: Response) => Observable.throw(error.json()));
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
       this.cartServ.resetCart();
    }
    if(!token){
      this.user['username']='';
      this.user['email']=null;
      this.cartServ.resetCart();
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
      console.log(exptime-currtime);
    }
 
  }
}
