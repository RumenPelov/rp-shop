import { Component, OnInit, Input } from '@angular/core';

import { Data } from "../../_services/data";

@Component({
  selector: 'list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.css']
})
export class ListCategoriesComponent implements OnInit {
  
  @Input() data: Data = new Data();
  
  constructor() { }

  ngOnInit() {
  }

}
