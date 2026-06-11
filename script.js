let gameBoard = (function(){
  let board = new Array(9).fill(null);

  function placeMarker(index, marker){
    if(board[index] == null){ board[index] = marker; return true; }
    return false; 
  }
  function getBoard(){ return board; }
  function reset(){ board = new Array(9).fill(null); }

  return { placeMarker, getBoard, reset };
})();


let player = function(name, marker){
  return { name, marker };
};


let gameController = (function(){
  let player1 = player("Player 1", "X");
  let player2 = player("Player 2", "O");
  let turn = 0;
  let gameActive = false;

  const winCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

  function setNames(name1, name2){
    player1.name = name1;
    player2.name = name2;
  }

  function reset(){
    gameBoard.reset();
    turn = 0;
    gameActive = true;
  }

  function checkWin(){
    let board = gameBoard.getBoard();
    for(let combo of winCombos){
      const [a, b, c] = combo;
      if(board[a] && board[a] === board[b] && board[b] === board[c])
        return { marker: board[a], combo };
    }
    return null;
  }

  function checkDraw(){
    return gameBoard.getBoard().every(cell => cell !== null);
  }

  function playRound(index){
    if(!gameActive) return null;

    const currentPlayer = turn % 2 === 0 ? player1 : player2;
    const placed = gameBoard.placeMarker(index, currentPlayer.marker);
    if(!placed) return null; // cell was taken, don't advance turn

    turn++;

    const win = checkWin();
    if(win){
      gameActive = false;
      const winnerName = win.marker === "X" ? player1.name : player2.name;
      return { type: "win", name: winnerName, combo: win.combo };
    }
    if(checkDraw()){
      gameActive = false;
      return { type: "draw" };
    }

    return { type: "continue", marker: (turn % 2 === 0 ? player1 : player2).marker,
             name: (turn % 2 === 0 ? player1 : player2).name };
  }

  function start(name1, name2){
    setNames(name1, name2);
    reset();
    return { marker: player1.marker, name: player1.name };
  }

  return { playRound, start, reset };
})();


let displayController = (function(){
  let scores = { p1: 0, p2: 0, draws: 0 };

  function renderBoard(){
    const cells = document.querySelectorAll(".cell");
    const board = gameBoard.getBoard();
    cells.forEach((cell, i) => {
      cell.textContent = board[i] || "";
      cell.classList.toggle("taken", board[i] !== null);
    });
  }

  function highlightWin(combo){
    const cells = document.querySelectorAll(".cell");
    combo.forEach(i => cells[i].classList.add("win"));
  }

  function setResult(text){ document.querySelector("#result").textContent = text; }
  function setTurn(text){ document.querySelector("#turn-indicator").textContent = text; }

  function updateScores(){
    document.querySelector("#score-p1").textContent = scores.p1;
    document.querySelector("#score-p2").textContent = scores.p2;
    document.querySelector("#score-draws").textContent = scores.draws;
  }


  document.querySelector("#start-btn").addEventListener("click", () => {
    const name1 = document.querySelector("#p1-input").value.trim() || "Player 1";
    const name2 = document.querySelector("#p2-input").value.trim() || "Player 2";
    document.querySelector("#p1-label").textContent = name1;
    document.querySelector("#p2-label").textContent = name2;
    scores = { p1: 0, p2: 0, draws: 0 };
    updateScores();

    const first = gameController.start(name1, name2);
    renderBoard();
    setResult("");
    setTurn(`${first.name}'s turn (${first.marker})`);
    document.querySelector("#setup").style.display = "none";
    document.querySelector("#game").style.display = "block";
  });


  document.querySelector("#restart-btn").addEventListener("click", () => {
    gameController.reset();
    renderBoard();
    document.querySelectorAll(".cell").forEach(c => c.classList.remove("win"));
    setResult("");
    document.querySelector("#restart-btn").style.display = "none";
  });


  document.querySelector("#new-game-btn").addEventListener("click", () => {
    document.querySelector("#setup").style.display = "block";
    document.querySelector("#game").style.display = "none";
  });


  document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("click", () => {
      const index = Number(cell.dataset.index);
      const result = gameController.playRound(index);
      if(!result) return; // null = cell taken or game over

      renderBoard();

      if(result.type === "win"){
        highlightWin(result.combo);
        setResult(`${result.name} wins!`);
        setTurn("");
        scores[result.name === document.querySelector("#p1-label").textContent ? "p1" : "p2"]++;
        updateScores();
        document.querySelector("#restart-btn").style.display = "inline-block";
      } else if(result.type === "draw"){
        setResult("It's a draw!");
        setTurn("");
        scores.draws++;
        updateScores();
        document.querySelector("#restart-btn").style.display = "inline-block";
      } else {
        setTurn(`${result.name}'s turn (${result.marker})`);
      }
    });
  });
})();