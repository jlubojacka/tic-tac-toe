import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

// cross field validation on FormGroup
export  function createLineCountValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {

    const width = formGroup.get('width')?.value;
    const height = formGroup.get('height')?.value;
    const lineCount = formGroup.get("lineCount")?.value;

    let maximum = Math.min(width,height);
    if (lineCount <= maximum){
      return null;
    } else {
      return {maxCount: maximum}; //return object indicating error with details
    }
  }
}
