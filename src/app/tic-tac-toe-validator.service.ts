import { Injectable } from '@angular/core';
import {TicTacToeValidator, WinnerFound} from "./tic-tac-toe-validator";


@Injectable({
  providedIn: 'root'
})

export class TicTacToeValidatorService {
  validator:TicTacToeValidator;

  constructor() {
    this.validator = new TicTacToeValidator();
  }

  validTicTacToe(board: string[][], lineCount: number): boolean {
    return this.validator.checkBoard(board, lineCount);
  }

  getWinner(): string | null {
    let winners = this.validator.winners;
    if (winners["X"].length > 0){
      return "X";
    } else if (winners["O"].length > 0){
      return "O";
    }
    return null;
  }

  testWinningMove(board: string[][]): boolean {
    let findMatches = this.validator.createComputerMatchFunc();
    try {
      this.validator.checkRows(board, findMatches);
      this.validator.checkColumns(board, findMatches);
      this.validator.checkDiagonals(board, findMatches);
    } catch (ex){
      if (ex instanceof WinnerFound){
        return true;
      }
    }
    return false;
  }

}
