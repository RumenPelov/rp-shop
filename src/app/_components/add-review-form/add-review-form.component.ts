import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ItemData } from "../../_services/item-data";
import { ServerService } from "../../_services/server.service";

@Component({
  selector: 'add-review-form',
  templateUrl: './add-review-form.component.html',
  styleUrls: ['./add-review-form.component.css']
})
export class AddReviewFormComponent implements OnInit {
  
  @Input() data: ItemData;
  @Output() newReview = new EventEmitter<number>();
  @ViewChild('f') form: NgForm;
  sixStars: any=Array.from(Array(5).keys());
  formValues :any;

  constructor (private serv: ServerService ) {

    this.formValues = {stars: 5, name:"", review:"" };
  }

  ngOnInit() {
  }

  onSubmit(){
    if (this.form.valid) {
      //console.log("Form Submitted!");
      this.serv.postReview(this.formValues.review, this.formValues.name,this.formValues.stars, this.data.item._id )
      .subscribe(
        data => {
          this.formValues.name='';
          this.formValues.review='';
          this.formValues.stars=5;

          this.newReview.emit(data.itemId);
          window.scrollTo(0, 0);
        },
        error => console.error("error")
      );
    }
  }

}
