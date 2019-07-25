import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router} from '@angular/router';


@Component({
  selector: 'search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent implements OnInit {
  _toggle:boolean = false;
  @Input() 
  set toggle(toggle: boolean) {
    this._toggle = toggle ;
    this._toggle ?  setTimeout(()=> {
      this.input1.nativeElement.focus()} , 0) : null;
  }
  get toggle(): boolean { return this._toggle; }
  @ViewChild("input1", {read: ElementRef}) input1: ElementRef;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  mouseOver() {
    this.input1.nativeElement.focus();
  }

  onLoginSubmit(value) {
    const url = `/search?query=${value.search}`;
    this.router.navigateByUrl(url);
    this.input1.nativeElement.value="";
  }

}
