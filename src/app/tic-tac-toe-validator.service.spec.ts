import { TestBed } from '@angular/core/testing';

import { TicTacToeValidatorService } from './tic-tac-toe-validator.service';

describe('TicTacToeValidatorService', () => {
  let service: TicTacToeValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicTacToeValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
