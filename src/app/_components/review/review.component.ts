import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  
  @Input() review: any;
  sixStars: any=Array.from(Array(5).keys());
  
  constructor() { }

  ngOnInit() {
  }

}
