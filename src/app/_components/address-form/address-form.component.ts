import { Component, OnInit, Input, Output, EventEmitter, ViewChild  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { States } from "../../_services/states";
import { Provinces } from "../../_services/provinces";

@Component({
  selector: 'address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit {
  private subForm: Subscription;
  private _isSubmited : boolean = false;
  @Input() caption: string;
  @Input() 
    set preFormValues(preFormValues : object){
      if(preFormValues){
        this.formValues = preFormValues;
      }

    }
    get preFormValues(): object {return this.formValues}
  @Input() 
    set isSubmited(isSubmited: boolean) {
      this._isSubmited = isSubmited ;
    }
    get isSubmited(): boolean { return this._isSubmited; }

  @ViewChild('f') form: NgForm;
  @Output() validChange = new EventEmitter(); 
  @Output('formValues') values = new EventEmitter(); 

  formValues : any = {state:"", country:""};
  validated :boolean;
  states : any = States;
  provinces: any = Provinces;
  
  constructor() { }

  ngOnInit() {
    this.subForm = this.form.statusChanges
                .subscribe(val => this.onFormChange());
  }

  onFormChange(){
    //console.log(this.form);
    if(this.form.valid){
      this.values.emit(this.formValues);
    }
    this.validChange.emit(this.form.valid);
  }



  ngOnDestroy() {
    this.subForm.unsubscribe();
  }

}
