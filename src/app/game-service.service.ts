import { Injectable } from '@angular/core';
import {TicTacToeValidatorService} from "./tic-tac-toe-validator.service";

enum GameState {
  playing = "playing",
  won = "match",
  full = "full"
}


@Injectable({
  providedIn: 'root'
})

export class GameService {
  initialBoardDimension = 3;
  boardMin = 3;
  boardMax = 10;
  boardWidth:number = this.initialBoardDimension;
  boardHeight:number = this.initialBoardDimension;
  lineCount:number = this.initialBoardDimension;
  players = {"X":{name: "1", symbol: "X"}, "O":{name: "2", symbol: "O"}};
  currentPlayer= this.players["X"];
  winner:string | null = null;
  board:string[][]= [['']];
  state : typeof GameState = GameState;
  currentState: GameState = GameState.playing;

  constructor(private tValidatorSrv: TicTacToeValidatorService){
    this.createBoard();
  }

  createBoard(){
    let b = [];
    for (let i=0; i < this.boardHeight; i++){
      let row = new Array(this.boardWidth).fill('');
      b.push(row);
    }
    this.board = b;
  }

  changeBoardDimensions(width:number,height:number, lineCount:number){
    this.boardWidth = width;
    this.boardHeight = height;
    this.lineCount = lineCount;
    this.reset(); // create new board with proper dimensions and reset state
  }

  switchPlayer(){
    if (this.currentPlayer.symbol === "X"){
      this.currentPlayer = this.players["O"];
    } else if (this.currentPlayer.symbol === "O"){
      this.currentPlayer = this.players["X"];
    }
  }

  reset(){
    this.currentPlayer = this.players["X"];
    this.winner = null;
    this.currentState = GameState.playing;
    this.createBoard();
  }

  getEmptyTileCount(){
    let emptyTileCount = 0;
    for (let row of this.board){
      emptyTileCount += row.filter(symbol => symbol === "").length
    }
    return emptyTileCount;
  }

  putSymbol(row:number,column:number){
    let isTileEmpty = this.board[row][column] == "";

    // prevent inserting symbol to nonempty tile or if game already ended
    if (isTileEmpty && this.winner == null){
      this.board[row][column] = this.currentPlayer.symbol;
      let isValid = this.tValidatorSrv.validTicTacToe(this.board, this.lineCount);
      if (isValid){
        this.winner = this.tValidatorSrv.getWinner();
        if (this.winner !== null){
          this.currentState = GameState.won;
          return  //end of game, current player won
        }
      }
      //check if board is full after this insert otherwise switch to second player
      let isFull = this.getEmptyTileCount() === 0;
      if (isFull) {
        this.currentState = GameState.full;
      } else {
        this.switchPlayer();
      }
    }
  }

}
