import { Component, ViewChild, AfterViewInit,ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  clientHeight: number ;
  footerHeight: number = 0;
  @ViewChild("footer") footerDiv: ElementRef;
  
   ngOnInit() {
    this.clientHeight = window.innerHeight; 
    
   }
   ngAfterViewInit() {
    this.updateMessage();
   }

   updateMessage(){
    setTimeout(() => {
      this.footerHeight=this.footerDiv.nativeElement.offsetHeight+20 + 70;
    }, 0)
  }


 }
