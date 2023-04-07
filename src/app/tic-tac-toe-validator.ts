


class MultipleWinnersError extends Error {
}

export class TicTacToeValidator {
  width = 0;
  height = 0;
  lineCount = 0;
  occurrences: any = {"X":0, "O":0, "":0};
  winners: any = {"X":[],"O":[]};
  pattern = /X{3}|O{3}/g;

  checkBoard(board: string[][], lineCount: any) : boolean{
    if (!this.isValid(board)) {
      console.log("Bad board dimensions");
      return false  // bad board dimensions
    }
    this.width = board[0].length;
    this.height = board.length;
    // accept lineCount as input
    let minDimension = Math.min(this.width, this.height);
    if (lineCount && lineCount >= 3 && lineCount <= minDimension){
      this.lineCount = lineCount;
    } else {
      this.lineCount = minDimension;
    }

    this.findOccurrences(board);

    let diff = this.occurrences["X"] - this.occurrences["O"];
    if (this.occurrences["X"] == 0 && this.occurrences["O"] == 1) {
      return false // game must start with X symbol
    }
    if (diff != 0 && diff != 1) { // neither 0 nor 1
      return false // players did not take turn correctly
    }

    this.pattern = new RegExp(`X{${this.lineCount}}|O{${this.lineCount}}`,"g");
    this.winners = {"X":[],"O":[]};
    try {
      let findMatches = this.createMatchFunction();
      this.checkRows(board, findMatches);
      this.checkColumns(board, findMatches);
      this.checkDiagonals(board, findMatches);
    } catch(ex){
      if (ex instanceof MultipleWinnersError){
        return false;
      } else {
        console.log("TicTacToeValidator Error", ex);
      }
    }
    if (this.winners["X"].length > 0 && diff == 0){
      //When X wins no more O symbols can be placed
      return false;
    }
    if (this.winners["O"].length > 0 && diff == 1){
      //When O wins number of X must be same as O
      return false;
    }

    return true;
  }

  createMatchFunction() {
    return (array: [], index: number, arr: []) => {

      let string = array.map(s => (s === "" ? "_" : s)).join("");
      let match = string.match(this.pattern);
      if (match) {
        if (!allEqual(match.map(m => m[0]))){ //both symbol sequences (XXX/OOO) found
          throw new MultipleWinnersError() //only one can be the winner
        }
        //check if opposite symbol match exists already !!!
        if (match[0].startsWith("X") && this.winners["O"].length  > 0){
          throw new MultipleWinnersError()
        }
        if (match[0].startsWith("O") && this.winners["X"].length  > 0){
          throw new MultipleWinnersError()
        }
        let symbol = match[0][0];
        this.winners[symbol].push(index);
      }
    }
  }

  isValid(board: string[][]) {
    if (!board) {
      return
    }
    let rowConstraint = (3 <= board.length) && (board.length <= 10);
    let columnConstraint = board.every(r => (3 <= r.length) && (r.length <= 10));
    let rowsAllEqual = allEqual(board.map(row => row.length));
    return rowConstraint && columnConstraint && rowsAllEqual;
  }


  checkRows(board: string[][], matchFunc: Function) {
    let i =0;
    for (let row of board) {
      matchFunc(row,i);
      i++;
    }
  }


  checkColumns(board: string[][], matchFunc: Function) {
    for (let col = 0; col < board[0].length; col++) {
      let column = [];
      for (let row = 0; row < board.length; row++) {
        column.push(board[row][col]);
      }
      matchFunc(column, [0,col]);
    }
  }

  checkDiagonals(board: string[][], matchFunc:Function){
    let b = this.flatArray(board);
    for (let i = this.lineCount - 1; i < this.width; i++){
      //initialize principal, opposite and two bottom diagonals
      let diagonals: any = [[],[],[],[]];
      let jumpCount = (i < this.height - 1) ? i : this.height - 1;

      for (let jump = 0; jump <= jumpCount; jump++){
        let distance = jump*(this.width-1);
        diagonals[0].push(b[i+distance]); //build principal diagonal
        let oppositeDistance = jump*(this.width+1);
        diagonals[1].push(b[this.width - 1 - i + oppositeDistance]); //build opposite diagonal
        if (i < this.height -1){
          diagonals[2].push(b[b.length-1  - i - distance]); //build principal bottom diagonal
          diagonals[3].push(b[b.length - this.width + i - oppositeDistance]) //build opposite bottom diagonal
        }
      }
      diagonals.forEach((el: []) => matchFunc(el));
    }
  }

  flatArray<T>(arr: T[]){
    return arr.reduce((acc: T[], element: T) => acc.concat(element), [])
  }

  findOccurrences(board: string[][]) {
    this.occurrences = {"X": 0, "O": 0, "": 0};
    for (let row of board) {
      for (let symbol of row) {
        this.occurrences[symbol] += 1;
      }
    }
  }

}

function allEqual<T>(array:T[]) : boolean {
  return array.length > 0 ? array.every((el: T) => el === array[0]) : false;
}
