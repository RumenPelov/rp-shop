import { Component, OnInit, Input } from '@angular/core';
import { Data } from "../../_services/data";

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input() data: Data = new Data();
  @Input() pages: Number[];

  constructor() { }

  ngOnInit() {
  }

}
