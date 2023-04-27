import {Component, OnDestroy, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import {Overlay, OverlayConfig} from "@angular/cdk/overlay";
import {TemplatePortal} from "@angular/cdk/portal";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  encapsulation: ViewEncapsulation.None //due to OverlayRef styles
})
export class ModalComponent implements OnDestroy{

  @ViewChild('modalTemplate') template! : TemplateRef<unknown>;

  config = new OverlayConfig({
    hasBackdrop: true,
    panelClass: ['modal__overlay', 'modal__overlay--active'],
    backdropClass: 'modal__backdrop',
    positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    scrollStrategy: this.overlay.scrollStrategies.block()
  });
  overlayRef = this.overlay.create(this.config);

  constructor(private viewContainerRef: ViewContainerRef, private overlay: Overlay){
    this.overlayRef?.backdropClick()
      .subscribe(() => {
        this.close();
    });
  }

  open(){
    if (! this.overlayRef.hasAttached()){
      this.overlayRef.attach(new TemplatePortal(this.template, this.viewContainerRef));
    }
  }

  close(){
    if (this.overlayRef.hasAttached()){
      this.overlayRef.detach();
    }
  }

  ngOnDestroy(){
    if (this.overlayRef.hasAttached()){
      this.overlayRef.detach();
      this.overlayRef.dispose(); //clean up from DOM
    }
  }

}
