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

  get circleComputerType(){
    return this.gameService.players["O"].type === 'computer';
  }
  set circleComputerType(isComputer: boolean){
    let type = isComputer ? 'computer' : 'human';
    this.gameService.players["O"].type = type;
  }

  checkPlayerType(event:any){
    let checked = event.target.checked;
    let currPlayer = this.gameService.currentPlayer;
    if (checked && currPlayer.symbol === "O"){
      this.gameService.playAsComputer();
    }
  }

}
