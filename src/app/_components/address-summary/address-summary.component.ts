import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'address-summary',
  templateUrl: './address-summary.component.html',
  styleUrls: ['./address-summary.component.css']
})
export class AddressSummaryComponent implements OnInit {
  
  @Input() address: any;
  @Output() edit = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  onEdit(){
    this.edit.emit(false);
  }

}
