let gameBoard = (function(){
    let board = new Array(9).fill(null);

    function placeMarker(index, marker){
        if(board[index] == null){
            board[index] = marker;
        }
    }

    function getBoard(){
        return board;
    }

    return{placeMarker, getBoard};
})();


let player = function(name, marker){
    return {name, marker};
};

let gameController = (function(){
    let player1 = player("player1", "X");
    let player2 = player("player2", "O");

    let turn = 0;
    let gamePlay = 1;

    const winningArray = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];


    function checkWin(){
        let board = gameBoard.getBoard();
        for(let i = 0; i < 8; i++){
            if((board[winningArray[i][0]] == board[winningArray[i][1]]) &&
                (board[winningArray[i][1]] == board[winningArray[i][2]]) &&
                (board[winningArray[i][0]] != null)){
                    gamePlay = 0;
                    return board[winningArray[i][0]];
                }
        }
    }

    function checkDraw(){
        let board = gameBoard.getBoard();
        if(board.every((elem) => elem != null) && !checkWin()){
            gamePlay = 0;
            return "Draw";
        }
    }

    function playRound(index){

        if(turn%2 == 0 && gamePlay){
            gameBoard.placeMarker(index, player1.marker);
            turn++;
        }
        else if(turn%2 == 1 && gamePlay){
            gameBoard.placeMarker(index, player2.marker);
            turn++;
        }
        console.log(gameBoard.getBoard());

        let win = checkWin();
        if(win) {
            return win;
        }
        else {
            return checkDraw();
        }

    }

    return playRound;
})();