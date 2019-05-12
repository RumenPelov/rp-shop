import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Item, ItemData } from "../../_services/item-data";

@Component({
  selector: 'item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent implements OnInit {
  
  @Input() item: Item;
  @Input() data: ItemData;
  @Input() buttonText: string;
  @Input() details: boolean = false;
  @Output() clicked = new EventEmitter<number>();

  private sixStars: any = Array.from(Array(5).keys());
  
  constructor() { }

  ngOnInit() {
 
  }

}
