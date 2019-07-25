import { Component,  HostListener, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'content-logo',
  templateUrl: './content-logo.component.html',
  styleUrls: ['./content-logo.component.css'],
  animations: [
    trigger('scrollAnimation', [
      state('show', style({
        opacity: 1,
        transform: "translateX(0)"
      })),
      state('hide',   style({
        opacity: 0,
        transform: "translateX(-100%)"
      })),
      transition('show => hide', animate('300ms ease-out')),
      transition('hide => show', animate('400ms ease'))
    ])
  ]
})

export class ContentLogoComponent  {
  _home:boolean = false;
  @Input() 
  set home(home: boolean) {
    this._home = home ;
    if(!this._home){
      setTimeout(() =>  this.state = "show", 300)
   }else{
    this.state = "hide"
   }
  }
  get home(): boolean { return this._home; }
  state:string = "hide";

  constructor( ) {}

  @HostListener('window:scroll', ['$event'])
    checkScroll() {
      if(this._home){
        this.setAnimState();
      }
  }
  @HostListener('window:resize', ['$event'])
    checkResize() {
      if(this._home){
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