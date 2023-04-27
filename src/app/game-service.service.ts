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
  players = {"X":{name: "1", symbol: "X", type: "human"}, "O":{name: "2", symbol: "O", type: "human"}};
  currentPlayer = this.players["X"];
  winner:string | null = null;
  board:string[][] = [['']];
  boardCopy: string[][] = [['']];
  lastCompMove: {row: number, column: number} | null = null;
  lastHumanMove: {row: number, column: number} | null = null;
  state : typeof GameState = GameState;
  currentState: GameState = GameState.playing;

  constructor(private tValidatorSrv: TicTacToeValidatorService){
    this.createBoard();
    this.copyBoard();
  }

  createBoard(){
    let b = [];
    for (let i=0; i < this.boardHeight; i++){
      let row = new Array(this.boardWidth).fill('');
      b.push(row);
    }
    this.board = b;
  }

  copyBoard(){
    //simple deep copy
    let copy = [];
    for (let i=0; i < this.boardHeight; i++){
      let row = [...this.board[i]];
      copy.push(row);
    }
    this.boardCopy = copy;
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
    this.copyBoard();
    this.lastCompMove = null;
    this.lastHumanMove = null;
  }

  getEmptyTileCount(){
    let emptyTileCount = 0;
    for (let row of this.board){
      emptyTileCount += row.filter(symbol => symbol === "").length
    }
    return emptyTileCount;
  }

  getEmptyIndices(board: string[][]): {row: number, column: number}[] {
    let empty = [];
    for (let row=0; row < board.length; row++){
      for (let column=0; column < board[0].length; column++){
        if (board[row][column] === ''){
          empty.push({row,column});
        }
      }
    }
    return empty;
  }

  putSymbol(row:number,column:number){
    let isTileEmpty = this.board[row][column] == "";

    // prevent inserting symbol to nonempty tile or if game already ended
    if (isTileEmpty && this.winner == null){
      this.board[row][column] = this.currentPlayer.symbol;
      this.boardCopy[row][column] = this.currentPlayer.symbol;
      let isValid = this.tValidatorSrv.validTicTacToe(this.board, this.lineCount);
      if (isValid){
        if (this.currentPlayer.type === "human"){
          this.lastHumanMove = {row, column};
        }
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
        if (this.currentPlayer.type === "computer"){
          this.playAsComputer();
        }
      }
    }
  }


  otherPlayer(symbol:string){
    return (symbol === "X") ? "O" : "X";
  }

  /* -- Computer gameplay --- */

  playAsComputer(){
    let indices = this.findComputerMove();
    if (indices !== null){
      let row = indices.row;
      let column = indices.column;
      this.lastCompMove = indices;
      setTimeout(() => this.putSymbol(row,column), 600); //milliseconds
    }
  }

  findComputerMove(){
    //check if computer could win
    let compWinMove = this.findWinningMove(this.currentPlayer.symbol);
    if (compWinMove){
      return compWinMove;
    }
    //check if second player could win in next round
    let playerWinMove = this.findWinningMove(this.otherPlayer(this.currentPlayer.symbol));
    if (playerWinMove){
      return playerWinMove;  //block other player
    }
    return this.findNearestMove();  //return this.findRandomMove();
  }

  findWinningMove(symbol: string): {row: number, column: number}|null {
    let emptyTiles = this.getEmptyIndices(this.board);
    let indices = null;
    for (let {row, column} of emptyTiles){
      this.boardCopy[row][column] = symbol;
      let wins = this.tValidatorSrv.testWinningMove(this.boardCopy);
      this.boardCopy[row][column] = "";  //revert changes
      if (wins){
        indices = {row,column};
        break;
      }
    }
    return indices;
  }


  findNearestMove(){
    //let initial = this.lastCompMove ?? this.lastHumanMove; //last computer move is null at start of the game
    let initial = this.lastHumanMove;
    let emptyTiles = new Set(this.getEmptyIndices(this.board));
    let found = null;
    if (initial){
      let maxDim = Math.max(this.boardWidth,this.boardHeight);
      for (let i=1; i <= maxDim; i++){ // increase candidate area
        let rowStart = Math.max(initial.row - i,0);
        let rowEnd = Math.min(initial.row + i, this.boardHeight);
        let colStart = Math.max(initial.column - i, 0);
        let colEnd = Math.min(initial.column + i, this.boardWidth);

        let inBetween = this.inBetweenFunc(rowStart , rowEnd , colStart , colEnd);
        let candidates = this.filterSet(emptyTiles,inBetween);
        if (candidates.size > 0){
          let randomIdx = this.rand(candidates.size);
          found = [...candidates][randomIdx];
          break;
        } else {
          emptyTiles = this.difference(emptyTiles, candidates); // in next round test unvisited tiles
        }
      }
    }
    return found;
  }


  inBetweenFunc(rowStart:number, rowEnd:number, colStart:number, colEnd:number){
    return (tile: {row:number,column:number}) => {
      let rowBetween = tile.row >= rowStart && tile.row <= rowEnd;
      let colBetween = tile.column >= colStart && tile.column <= colEnd;
      return rowBetween && colBetween;
    }
  }

  filterSet(set: Set<{row:number,column:number}>, condition: Function): Set<{row:number,column:number}>{
    let filtered: Set<{row:number,column:number}> = new Set();
    for (let s of set){
      if (condition(s)){
        filtered.add(s);
      }
    }
    return filtered;
  }

  difference(wholeSet: Set<{row:number,column:number}>, subSet: Set<{row:number,column:number}>){
      return new Set([...wholeSet].filter(el => !subSet.has(el)));
  }

  findRandomMove(){
    let emptyTiles = this.getEmptyIndices(this.board);
    if (emptyTiles.length > 0){
      let idx = this.rand(emptyTiles.length);
      return emptyTiles[idx];
    }
    return null
  }

  rand(max:number){
    return Math.floor(Math.random() * max);
  }

}
