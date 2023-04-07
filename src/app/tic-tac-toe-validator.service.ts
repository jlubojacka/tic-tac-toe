import { Injectable } from '@angular/core';
import {TicTacToeValidator} from "./tic-tac-toe-validator";


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
}
