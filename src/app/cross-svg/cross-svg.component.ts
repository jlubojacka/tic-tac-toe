import { Component } from '@angular/core';

@Component({
  selector: 'cross-svg',
  templateUrl: './cross-svg.component.svg',
  styles: [
    `
    path.draw {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: animateDash 2s linear forwards 1;
    }

    @keyframes animateDash {
      to {
        stroke-dashoffset: 0;
      }
    }

    `
  ],
})
export class CrossSvgComponent {
  fillColor = '#022a6b';

}
