import {Component, OnInit} from '@angular/core';
import { GameService } from "./game-service.service";
import {trigger, transition, style, animate} from '@angular/animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(100px)' }),
        animate('500ms', style({ opacity: 1, transform: 'translateY(0)'})),
      ]),
      transition(':leave', [
        animate('500ms', style({ opacity: 0, transform: 'translateY(100px)' })),
      ]),
    ])
  ]
})

export class AppComponent {
  title = 'tic-tac-toe';
  currentState = this.gameService.currentState;
  stateEnum = this.gameService.state;

  constructor(private gameService: GameService){}

  wins(){
    return this.gameService.currentState === this.stateEnum.won;
  }

  get statusMessage(){
    if (this.gameService.currentState === this.stateEnum.won){
      let playerName = this.gameService.currentPlayer.name;
      return `Player ${playerName} wins!`;
    } else if (this.gameService.currentState === this.stateEnum.full){
      return "No more moves!"
    }
    return ""
  }

  resetGame(){
    this.gameService.reset();
  }

}

