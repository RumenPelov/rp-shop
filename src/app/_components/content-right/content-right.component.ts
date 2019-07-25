import { Component,  HostListener,  Input, SimpleChanges  } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'content-right',
  templateUrl: './content-right.component.html',
  styleUrls: ['./content-right.component.css'],
  animations: [
    trigger('moveLeft', [
      state('show', style({
        marginLeft: "0px"
      })),
      state('hide',   style({
        marginLeft: "-123px"
      })),
      transition('show => hide', animate('300ms ease-out')),
      transition('hide => show', animate('400ms ease'))
    ])
  ]
})

export class ContentRightComponent {
  _toggle:boolean = false;
  _home:boolean = false;
  @Input() 
  set toggle(toggle: boolean) {
    this._toggle = toggle ;
    if(this._toggle){
      this.state = 'show';
    } else {
      this._home ? setTimeout(() => this.setAnimState(), 300): null;
    }
  }
  get toggle(): boolean { return this._toggle; }
  @Input() 
  set home(home: boolean) {
    this._home = home ;
    if(!this._home){
      setTimeout(() =>  this.state = "show", 300)
   }else{
    this._toggle ? this.state = "show" : setTimeout(()=> this.setAnimState() , 0);
   }
  }
  get home(): boolean { return this._home; }
  state:string = "hide";
  
  constructor( ) {}


  @HostListener('window:scroll', ['$event'])
    checkScroll() {
      if(this._home && !this._toggle){
        this.setAnimState();
      }
    }
  @HostListener('window:resize', ['$event'])
    checkResize() {
      if(this._home && !this._toggle){
        this.setAnimState();
      }
  }
  setAnimState(){
    const scrollPosition = window.pageYOffset
    const width = window.innerWidth;
    const pos = width/1.94 - 56;
    
    if (scrollPosition >= pos) {
      this.state = 'show';
    } else {
      this.state = 'hide';
    }
  }
}
