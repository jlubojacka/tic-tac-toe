import {Component, ElementRef, EventEmitter, HostListener, Output, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {createLineCountValidator} from "./lineCountValidator";
import {GameService} from "../game-service.service";

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent {

  @ViewChild('modal') modal: any = undefined;

  dimensionValidators = [Validators.required, Validators.min(this.gameService.boardMin), Validators.max(this.gameService.boardMax)];
  boardForm: FormGroup = this.fb.group({
    "width": [this.gameService.boardWidth, {validators: this.dimensionValidators}],
    "height": [this.gameService.boardHeight, {validators: this.dimensionValidators}],
    "lineCount": [this.gameService.lineCount, {validators: [Validators.required, Validators.min(3)]}]
  }, {validators: [createLineCountValidator()]})


  constructor(private fb: FormBuilder, private gameService: GameService){}

  get width(){
    return this.boardForm.controls["width"];
  }
  get height(){
    return this.boardForm.controls["height"];
  }
  get lineCount(){
    return this.boardForm.controls["lineCount"];
  }
  get minimum(){
    return this.gameService.boardMin;
  }
  get maximum(){
    return this.gameService.boardMax;
  }

  lineCountErrorMessage(){
    let max = this.boardForm.errors?.['maxCount'];
    if (max >= 3 && max <= 10){
      return `Line count value must not exceed ${max}.`;
    } else {
      if (this.width.errors || this.height.errors){
        return "Please correct board dimension."
      }
      return `Line count value must be between ${this.minimum} and ${this.maximum} inclusive.`
    }
  }

  showModal(){
    this.modal?.open();
  }

  submit(){
    if (this.width.value && this.height.value && this.lineCount.value) {
      this.gameService.changeBoardDimensions(this.width.value, this.height.value, this.lineCount.value);
      this.modal?.close();
    }
  }

  closeModal(){
    this.modal?.close();
  }
}
