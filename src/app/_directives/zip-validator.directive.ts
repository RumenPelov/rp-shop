import { Directive, Input} from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS, ValidatorFn} from '@angular/forms';

function postalCodeValidator(country: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        const usRegex= new RegExp('^[0-9]{5}(?:-[0-9]{4})?$');
        const canRegex= new RegExp('^[A-Za-z]\\d[A-Za-z][ -]?\\d[A-Za-z]\\d$');
        let zipValid;
        if(country === "can") {
           zipValid = canRegex.test(control.value);
        } else {
            zipValid = usRegex.test(control.value);
        }
        return zipValid ? null :  {"invalidZip" : {value: control.value}} ;
        
    };
  }

@Directive({
    selector: '[zipValidator]',
    providers: [{provide: NG_VALIDATORS, useExisting: ZipValidatorDirective, multi: true}]
  })
  export class ZipValidatorDirective implements Validator {

    @Input('zipValidator') countryName: string;
   
    validate(control: AbstractControl): {[key: string]: any} | null {
      return this.countryName ? postalCodeValidator(this.countryName)(control)
                                : null;
    }
  }