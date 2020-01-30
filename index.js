class Board {
  static NEXT_PLAYER_MAP = {
    '🔴': '🔵',
    '🔵': '🔴',
  };

  static PLAYER_TO_COLOR_MAP = {
    '🔴': 'red',
    '🔵': 'blue',
  };

  static SUB_CELL_STATES = {
    empty: undefined,
    blue: 'blue',
    red: 'red',
  };

  static SUPER_CELL_STATES = {
    playable: 'playable',
    unplayable: 'unplayable',
    redTaken: 'redTaken',
    blueTaken: 'blueTaken',
    tied: 'tied',
  };

  static WIN_STATES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  _boardState = [];

  _superCellStates = [];

  constructor(onInit) {
    this.currentPlayer = '🔴';

    for (let i = 0; i < 9; i++) {
      this._boardState.push(Array(9).fill(Board.SUB_CELL_STATES.empty));
      this._superCellStates = Array(9).fill(Board.SUPER_CELL_STATES.unplayable);
    }

    this.setBoardForNextMove(4, () => {});

    onInit(this._superCellStates);
  }

  updatePlayer() {
    this.currentPlayer = Board.NEXT_PLAYER_MAP[this.currentPlayer];
  }

  updateBoardState(superCellIndex, subCellIndex) {
    this._boardState[superCellIndex][subCellIndex] =
      Board.SUB_CELL_STATES[Board.PLAYER_TO_COLOR_MAP[this.currentPlayer]];
  }

  checkSuperCellWin(superCellIndex, onCellWin, onCellTie) {
    let superCellWon = false;
    let victoriousPlayer;
    const superCell = this._boardState[superCellIndex];

    for (let i = 0; i < Board.WIN_STATES.length; i++) {
      const [i1, i2, i3] = Board.WIN_STATES[i];
      if (superCell[i1] === superCell[i2] && superCell[i2] === superCell[i3] && superCell[i1] === superCell[i3]) {
        if (superCell[i1] === Board.SUB_CELL_STATES.red) {
          superCellWon = true;
          victoriousPlayer = Board.SUB_CELL_STATES.red;
          break;
        } else if (superCell[i1] === Board.SUB_CELL_STATES.blue) {
          superCellWon = true;
          victoriousPlayer = Board.SUB_CELL_STATES.blue;
          break;
        }
      }
    }

    if (superCellWon) {
      if (victoriousPlayer === Board.SUB_CELL_STATES.red) {
        this._superCellStates[superCellIndex] = Board.SUPER_CELL_STATES.redTaken;
        onCellWin(Board.SUB_CELL_STATES.red);
      } else {
        this._superCellStates[superCellIndex] = Board.SUPER_CELL_STATES.blueTaken;
        onCellWin(Board.SUB_CELL_STATES.blue)
      }
    } else if (!superCell.some((subCell) => subCell === Board.SUB_CELL_STATES.empty)) {
      onCellTie();
    }
  }

  checkOutrightGameWin(onGameWin) {
    let gameWonOutright = false;
    let victoriousPlayer;

    for (let i = 0; i < Board.WIN_STATES.length; i++) {
      const [i1, i2, i3] = Board.WIN_STATES[i];
      if (this._superCellStates[i1] === this._superCellStates[i2]
        && this._superCellStates[i2] === this._superCellStates[i3]
        && this._superCellStates[i1] === this._superCellStates[i3]
        && (this._superCellStates[i1] === Board.SUPER_CELL_STATES.redTaken || this._superCellStates[i1] === Board.SUPER_CELL_STATES.blueTaken)
      ) {
        gameWonOutright = true;
        victoriousPlayer = this.currentPlayer;
        onGameWin(this.currentPlayer);
      }
    }

    return gameWonOutright;
  }

  setBoardForNextMove(targetSuperCellIndex, onBoardSet) {
    const { playable, unplayable, redTaken, blueTaken, tied } = Board.SUPER_CELL_STATES;

    const superCellIsPlayable = (cell) => cell !== redTaken && cell !== blueTaken && cell !== tied;
    
    const nextSupCellState = this._superCellStates[targetSuperCellIndex];

    const nextCellStateAlreadyDetermined = !superCellIsPlayable(nextSupCellState);

    let nextPlayableCellIndices = [];
    if (nextCellStateAlreadyDetermined) {
      this._boardState[targetSuperCellIndex].forEach((subCellState, index) => {
        if (subCellState === Board.SUB_CELL_STATES.empty && superCellIsPlayable(this._superCellStates[index])) {
          nextPlayableCellIndices.push(index);
        }
      });
    } else {
      nextPlayableCellIndices.push(targetSuperCellIndex);
    }

    this._superCellStates.forEach((state, index) => {
      if (nextPlayableCellIndices.includes(index)) {
        this._superCellStates[index] = playable;
      } else if (superCellIsPlayable(state)) {
        this._superCellStates[index] = unplayable;
      }
    });

    onBoardSet(this._superCellStates);
  }
}

const updateNextPlayerText = (newPlayer) => {
  $nextPlayerSpan = $('.next-player');
  $nextPlayerSpan.html(newPlayer);
};

$(() => {
  const reflectDomBoardWithSuperCellStates = (superCellStates) => {
    superCellStates.forEach((superCellState, index) => {
      const $superCell = $(`.super-cell-${index}`);

      if (superCellState === Board.SUPER_CELL_STATES.unplayable) {
        $superCell.addClass('unplayable');
        $superCell.find('button').attr('disabled', true);
      } else if (superCellState === Board.SUPER_CELL_STATES.playable) {
        $superCell.removeClass('unplayable');
        $superCell.find('button').attr('disabled', false);
      } else {
        $superCell.removeClass('unplayable');
      }
    });
  };

  const board = new Board(reflectDomBoardWithSuperCellStates);

  $('.super-board button').click((event) => {
    const $subCell = $(event.target);

    if ($subCell.html()) return;

    $subCell.html(board.currentPlayer);
    $subCell.prop('disabled', true);

    const subCellClass = $subCell.attr('class');
    const superCellIndex = +subCellClass.charAt(0);
    const subCellIndex = +subCellClass.charAt(1);

    board.updateBoardState(superCellIndex, subCellIndex);

    board.checkSuperCellWin(superCellIndex, (superCellWinner) => {
      const $superCellTable = $subCell
        .parent()
        .parent()
        .parent()
        .parent();
      
      if (superCellWinner === Board.SUB_CELL_STATES.red) {
        $superCellTable.addClass('red-taken');
      } else {
        $superCellTable.addClass('blue-taken');
      }

      $superCellTable.find('button').each((_, button) => {
        $(button).attr('disabled', true);
      });
    }, () => {
      const $superCellTable = $subCell
        .parent()
        .parent()
        .parent()
        .parent();

        $superCellTable.addClass('tied');
    });

    const gameWon = board.checkOutrightGameWin((winningPlayer) => {
      $('.describing-text').html(`${winningPlayer} wins the game!`);
      $('.super-board button').attr('disabled', true);
      $('td[class^="super-cell-"').each((index, superCell) => {
        $(superCell).removeClass('unplayable');
      });
      $('.replay-button').removeClass('d-none');
    });

    if (!gameWon) {
      board.setBoardForNextMove(subCellIndex, reflectDomBoardWithSuperCellStates);
  
      board.updatePlayer();
  
      updateNextPlayerText(board.currentPlayer);
    }
  });
});
