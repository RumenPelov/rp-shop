import { Component, OnInit, ViewChild, AfterViewInit,ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  clientHeight: number;
  footerHeight: number;
  @ViewChild("footer") footerDiv: ElementRef;
  
  constructor() {
    this.clientHeight = window.innerHeight; 
 }
 ngAfterViewInit() {
   this.footerHeight=this.footerDiv.nativeElement.offsetHeight+20 + 70; 
 }
 }
