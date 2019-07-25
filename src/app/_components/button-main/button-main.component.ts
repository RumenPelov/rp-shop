import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'button-main',
  template: `
  <button class="btn-custom-outline" 
  >
    {{text}}
    <svg class="arrow_icon ">
        <use xlink:href='assets/svg/sprite.svg#icon-chevron-small-right'></use>
    </svg>
  </button>
  `,
  styleUrls: ['./button-main.component.css']
})
export class ButtonMainComponent implements OnInit {
  @Input() text: String;
 
  
  constructor() { }

  ngOnInit() {
  }

}
