const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const cells = [...boardEl.querySelectorAll(".cell")];

let board = Array(9).fill(null);
let current = "X";
let gameOver = false;

function getWinner() {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line: [a, b, c] };
    }
  }
  return null;
}

function setStatus(text, className = "") {
  statusEl.textContent = text;
  statusEl.className = `status${className ? ` ${className}` : ""}`;
}

function endGame(message, className, winLine = []) {
  gameOver = true;
  setStatus(message, className);
  cells.forEach((cell, i) => {
    cell.disabled = true;
    if (winLine.includes(i)) cell.classList.add("win");
  });
}

function handleMove(index) {
  if (gameOver || board[index]) return;

  board[index] = current;
  const cell = cells[index];
  cell.textContent = current;
  cell.classList.add(current.toLowerCase(), "placed");
  cell.disabled = true;
  cell.setAttribute("aria-label", `Cell ${index + 1}, ${current}`);

  const winner = getWinner();
  if (winner) {
    endGame(`${winner.player} wins!`, "winner", winner.line);
    return;
  }

  if (board.every(Boolean)) {
    endGame("It's a draw.", "draw");
    return;
  }

  current = current === "X" ? "O" : "X";
  setStatus(`${current}'s turn`);
}

function resetGame() {
  board = Array(9).fill(null);
  current = "X";
  gameOver = false;
  setStatus("X's turn");

  cells.forEach((cell, i) => {
    cell.textContent = "";
    cell.disabled = false;
    cell.className = "cell";
    cell.setAttribute("aria-label", `Cell ${i + 1}`);
  });
}

boardEl.addEventListener("click", (e) => {
  const cell = e.target.closest(".cell");
  if (!cell) return;
  handleMove(Number(cell.dataset.index));
});

resetBtn.addEventListener("click", resetGame);
