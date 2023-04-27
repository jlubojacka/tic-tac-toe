import { Component } from '@angular/core';
import {trigger,transition,style,animate} from '@angular/animations';

@Component({
  selector: 'circle-svg',
  templateUrl: './circle-svg.component.svg',
  //styleUrls: [],
  styles: [
    `
    path.draw {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: animateDash 1500ms linear forwards 1;
    }

    @keyframes animateDash {
      to {
        stroke-dashoffset: 0;
      }
    }

    `
  ]
})
export class CircleSvgComponent {
  fillColor = 'red';
}
