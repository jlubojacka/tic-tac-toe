import { Component } from '@angular/core';
import {GameService} from '../game-service.service'

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent {
  constructor(private gameService: GameService){}

  get circleName(){
    return this.gameService.players["O"].name;
  }
  get markName(){
    return this.gameService.players["X"].name;
  }

  get currentPlayer(){
    return this.gameService.currentPlayer;
  }

}
