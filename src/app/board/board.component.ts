import {Component, Input} from '@angular/core';
import {GameService} from "../game-service.service";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  constructor( public gameService: GameService){

  }

  tilePosition(index:number, tileSymbol:string){
    return `tile-${tileSymbol}-${index}`
  }

  putSymbol(row:number, column:number){
    if (this.gameService.currentPlayer.type === "computer"){
      return
    }
    this.gameService.putSymbol(row,column);
  }

  get board(){
    return this.gameService.board;
  }

  boardDimensions(){
    let size = Math.max(this.gameService.boardWidth, this.gameService.boardHeight)
    return {
      "grid-template-rows": `repeat(${this.gameService.boardHeight}, 1fr)`,
      "grid-template-columns": `repeat(${this.gameService.boardWidth}, 1fr)`,
      "--tile-size-coeff": size
    };
  }

  tileDimensions() {
    return {

    }
  }

}
