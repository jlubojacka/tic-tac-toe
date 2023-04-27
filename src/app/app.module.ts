import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay'
import {A11yModule} from "@angular/cdk/a11y";

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { CrossSvgComponent } from './cross-svg/cross-svg.component';
import { CircleSvgComponent } from './circle-svg/circle-svg.component';
import { ControlsComponent } from './controls/controls.component';
import {TicTacToeValidatorService} from "./tic-tac-toe-validator.service";
import {GameService} from "./game-service.service";
import { PlayersComponent } from './players/players.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    CircleSvgComponent,
    CrossSvgComponent,
    ControlsComponent,
    PlayersComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    OverlayModule,
    A11yModule
  ],
  providers: [TicTacToeValidatorService, GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
