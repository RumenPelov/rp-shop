import { Component, OnInit, HostListener } from '@angular/core';
import { Router} from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs';
import { AuthService } from "../_services/auth.service";
import { CartService } from "../_services/cart.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('scrollHeader', [
      state('show', style({
        backgroundColor: "#1A548F",
      })),
      state('hide',   style({
        backgroundColor: "transparent",
      })),
      transition('show => hide', animate('100ms ease-out')),
      transition('hide => show', animate('0ms ease-in'))
    ])
  ]
})
export class HeaderComponent implements OnInit {
  private subCart: Subscription;
  private subRoute:any;
  home: boolean = true;
  toggle: boolean = false;
  items: number;
  state = 'hide';
  constructor(public auth:AuthService,
              private router: Router,
              private cartServ:CartService) {
              }
              
  @HostListener('window:scroll', ['$event'])
    checkScroll() {

    if(this.home && !this.toggle){
      this.setAnimState();
    }
  }

  @HostListener('window:resize', ['$event'])
    checkResize() {
  
    if(this.home && !this.toggle){
      this.setAnimState();
    }
  }

  setAnimState(){
    let scrollPosition = window.pageYOffset;
    const width = window.innerWidth;
    const pos = width/1.94 - 56;
   
    if (scrollPosition >= pos) {
      this.state = 'show';
    } else {
      this.state = 'hide';
    }
  }

  ngOnInit() {
    this.auth.updateUser();
    this.subCart=this.cartServ.getCart()
          .subscribe(cart =>{
            this.items=this.countCartItems(cart.items);
          }); 
 
    this.subRoute =this.router.events
        .subscribe((url:any) => {
          if(url.url !== undefined){
            const path=url.url;
            if(path.length === 1 || path.length === 0 || path[1]==="?"){
              this.home=true;
              this.toggle ? this.state = "show" : setTimeout(()=> this.setAnimState() , 0);
 
            }else{
              this.home=false;
              this.state = 'show';
            }
          }
        });
  }

  countCartItems(items){
    let count=0;
    for (let item of items) {
      count= count + item.quantity;
    }
    return count;
  }

  logout(){
    this.auth.clearSession();    
    this.cartServ.resetCart();
  }

  toggleNav(){
    this.toggle = !this.toggle;
    if(this.home){
      if(this.toggle) {
        this.state = "show";
     } else {
       setTimeout(() => this.setAnimState(), 300)
     }
    }
  }

  ngOnDestroy() {
    this.subCart.unsubscribe();
    this.subRoute.unsubscribe();
  }
}

  