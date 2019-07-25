import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  private _data : any;
  address : any;
  items : any;
  @Input()
  set data(data: any) {
    this._data=data
    this.address = data.address;
    this.items = data.items ;
  }
 
  get data(): any { return this._data; }

  constructor() { }

  ngOnInit() {

  }

}
