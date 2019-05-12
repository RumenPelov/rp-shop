import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'button-main',
  template: `
  <button class="btn btn-primary bg-custom pl-3" 
  >
    {{text}}
    <svg class="arrow_icon ">
        <use xlink:href='assets/svg/sprite.svg#icon-chevron-small-right'></use>
    </svg>
  </button>
  `,
  styles: []
})
export class ButtonMainComponent implements OnInit {
  @Input() text: String;
 
  
  constructor() { }

  ngOnInit() {
  }

}
