//player factory function
const Player = (sign) => {
  const getSign = () => sign;

  return { getSign };
};

//gameboard module function
const GameBoard = (() => {
  const board = ["", "", "", "", "", "", "", ""];

  const getPos = (idx) => (idx < board.length ? board[idx] : undefined);

  const setPos = (sign, idx) => {
    if (idx > board.length) return;
    board[idx] = sign;
  };

  const reset = () => {
    for (i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };
  return { board, getPos, setPos, reset };
})();

//gameController module function
const gameController = (() => {
  const resultElement = document.querySelector(".resultMessage");
  const messageElement = document.querySelector(".message");
  const player1 = Player("X");
  const player2 = Player("O");
  let round = 1;
  let isOver = false;

  const playRound = (boxIdx) => {
    GameBoard.setPos(getCurrentPlayerSign(), boxIdx);
    if (checkWinner(boxIdx)) {
      resultElement.style.visibility = "visible";
      messageElement.style.visibility = "hidden";
      displayController.setMessage("");
      displayController.setResultMessage(
        `${round % 2 == 1 ? "Player 1" : "Player 2"}`
      );
      displayController.restartBtnShow();
      isOver = true;
      return;
    }

    if (round == 9) {
      resultElement.style.visibility = "visible";
      messageElement.style.visibility = "hidden";
      displayController.setMessage("");
      displayController.setResultMessage("Draw");
      isOver = true;
      displayController.restartBtnShow();
      return;
    }
    round++;
    displayController.setMessage(getCurrentPlayerSign());
  };

  const checkWinner = (boxIdx) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winConditions
      .filter((condition) => condition.includes(boxIdx))
      .some((someCondition) =>
        someCondition.every(
          (idx) => GameBoard.getPos(idx) === getCurrentPlayerSign()
        )
      );
  };

  const getCurrentPlayerSign = () =>
    round % 2 == 1 ? player1.getSign() : player2.getSign();

  const getIsOver = () => {
    return isOver;
  };

  const reset = () => {
    isOver = false;
    round = 1;
  };

  return { reset, getIsOver, playRound };
})();

//displayController module function
const displayController = (() => {
  const boxElements = document.querySelectorAll(".box");
  const resultElement = document.querySelector(".resultMessage");
  const messageElement = document.querySelector(".message");
  const restartBtn = document.querySelector(".restart-btn");

  boxElements.forEach((box) =>
    box.addEventListener("click", (e) => {
      if (gameController.getIsOver() || e.target.textContent !== "") return;
      resultElement.style.visibility = "hidden";
      gameController.playRound(parseInt(e.target.dataset.index));
      updateGameBoard();
    })
  );

  restartBtn.addEventListener("click", () => {
    gameController.reset();
    GameBoard.reset();
    restartBtn.style.display = "none";
    updateGameBoard();
    messageElement.textContent = "X's turn";
    setResultMessage("Player 1's Turn : Your Sign is  'X'");
  });

  const restartBtnShow = () => {
    restartBtn.style.display = "block";
    messageElement.style.visibility = "visible";
  };

  const updateGameBoard = () => {
    for (i = 0; i < boxElements.length; i++) {
      boxElements[i].textContent = GameBoard.getPos(i);
    }
  };

  const setResultMessage = (winner) => {
    if (winner == "draw") {
      resultElement.textContent = "It's Draw";
    } else if (winner == "Player 1" || winner == "Player 2") {
      resultElement.textContent = `${winner} has Won`;
    } else {
      resultElement.textContent = winner;
    }
  };

  const setMessage = (message) => {
    messageElement.textContent = `current turn : ${message}`;
  };

  return { setResultMessage, setMessage, restartBtnShow };
})();
