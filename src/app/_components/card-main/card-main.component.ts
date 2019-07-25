import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Item} from "../../_services/item-data";

@Component({
  selector: 'card-main',
  templateUrl: './card-main.component.html',
  styleUrls: ['./card-main.component.css']
})
export class CardMainComponent implements OnInit {

  @Input() item: Item;
  @Input() buttonText: string;
  @Output() addToCart = new EventEmitter<Item>();

  private sixStars: any = Array.from(Array(5).keys());
  
  constructor() { }

  ngOnInit() {
  }

  toCart(){
    this.addToCart.emit(this.item);
  }

}