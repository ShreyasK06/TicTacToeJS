const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const winRecord = document.querySelector("#winRecord");
const mode = document.querySelector("#mode");
const gameType = document.getElementById("gameType");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let xWin = 0;
let yWin = 0;
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let twoPlayerGame = true;
let aiGame = false;
let available = [];
let moves = 0;

initializeGame();

function initializeGame() {
    gameType.innerText = "TWO PLAYER GAME";
    console.log(gameType.innerText);
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    winRecord.textContent = `${xWin} : ${yWin}`;
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
    mode.addEventListener("click", checkTwoPlayer);
}

function checkTwoPlayer() {
    if (twoPlayerGame) {
        twoPlayerGame = false;
        aiGame = true;
        gameType.innerText = "PLAYING AGAINST AI";
        console.log(gameType.innerText);

    } else if (aiGame) {
        twoPlayerGame = true;
        aiGame = false;
        gameType.innerText = "TWO PLAYER GAME";
        console.log(gameType.innerText);
    }
}


function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex");

    if (options[cellIndex] != "" || !running) {
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();
}
function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
    console.log(currentPlayer + " moved on " + index);
    moves++;
}

function changePlayer() {
    if (twoPlayerGame) {
        currentPlayer = (currentPlayer == "X") ? "O" : "X";
        statusText.textContent = `${currentPlayer}'s turn`;

    } else if (!twoPlayerGame && currentPlayer == "X") {
        currentPlayer = "O";
        available = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i] == "") {
                available.push(i);
            }
        }
        aiMove = minimax(available, options);
        console.log(aiMove);
        if (aiMove >= 0 && aiMove <= 8) {
            updateCell(document.getElementById(aiMove), aiMove);
        }
        currentPlayer = (currentPlayer == "X") ? "O" : "X";
        aiWin();
    }
}

function keyPressed() {
    window.addEventListener('keydown', (event) => {
        if (event.key === 'r') {
            restartGame();
        }
    });
}

function minimax(canMove, allOptions) {
    let board = allOptions;
    if (moves == 1 && board[4] == "") {
        return 4;
    } else {
        let moves = [];
        let oWin = false;
        let xMoveWin = [];
        let opWin = false;
        let myWin = false;
        for (let i = 0; i < canMove.length; i++) {
            board[canMove[i]] = "O";
            if (win(board, "O")) {
                board[canMove[i]] = "";
                myWin = true;
                return canMove[i];
            } else {
                board[canMove[i]] = "X";
                if (win(board, "X")) {
                    board[canMove[i]] = "";
                    opWin = true;
                    xMoveWin.push(canMove[i]);
                } else {
                    board[canMove[i]] = "";
                    moves.push(canMove[i]);
                }
            }
        }
        if (!myWin) {
            return xMoveWin[Math.floor(Math.random() * xMoveWin.length)];
        }
        if (!opWin && !myWin) {
            return moves[Math.floor(Math.random() * moves.length)];
        }
    }
}


function win(board, turn) {
    let won = false;
    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = board[condition[0]];
        const cellB = board[condition[1]];
        const cellC = board[condition[2]];

        if (cellA == "" || cellB == "" || cellC == "") {
            console.log("continue");
            continue;
        }
        if (cellC == cellB && cellB == cellA && cellA == turn) {
            console.log(cellA + " " + cellB + " " + cellC);
            console.log(condition[0] + " " + condition[1] + " " + condition[2]);
            won = true;
            return true;
        }
    }
    if (!won) {
        console.log("false");
        return false;
    }
}

function aiWin() {
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA == "" || cellB == "" || cellC == "") {
            continue;
        }
        if (cellA == cellB && cellB == cellC) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `AI wins!`;
        if (currentPlayer == "O") {
            xWin++;
            winRecord.textContent = `${xWin} : ${yWin}`;
        }
        else {
            yWin++;
            winRecord.textContent = `${xWin} : ${yWin}`;
        }
        running = false;
        winRecord.textContent = `${xWin} : ${yWin}`;
    }
}

function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA == "" || cellB == "" || cellC == "") {
            continue;
        }
        if (cellA == cellB && cellB == cellC) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        if (currentPlayer == "X") {
            xWin++;
            winRecord.textContent = `${xWin} : ${yWin}`;
        }
        else {
            yWin++;
            winRecord.textContent = `${xWin} : ${yWin}`;
        }
        running = false;
        winRecord.textContent = `${xWin} : ${yWin}`;
    }
    else if (!options.includes("")) {
        statusText.textContent = `Draw!`;
        running = false;
    }
    else {
        changePlayer();

    }
}
function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
}