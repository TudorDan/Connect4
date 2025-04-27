/**
 * =============================
     Scriptul Jocului
=================================
 */

/* Elemente HTML */
const menu = document.getElementById('menu');
const game = document.getElementById('game');
const board = document.getElementById('board');
const statusDiv = document.getElementById('status');

/* Configurare generală */
const rows = 6;
const cols = 7;
let currentPlayer = 1;
let grid = [];
let playerColors = { 1: 'red', 2: 'yellow' };

/* Sunete */
const clickSounds = [
  new Audio('sounds/click1.wav'),
  new Audio('sounds/click2.wav'),
  new Audio('sounds/click3.wav')
];
const winSound = new Audio('sounds/win.wav');
const drawSound = new Audio('sounds/draw.wav');

/* Pornire joc */
function startGame() {
  // Setează culorile alese
  const color1 = document.getElementById('player1Color').value;
  const color2 = document.getElementById('player2Color').value;
  playerColors[1] = color1;
  playerColors[2] = color2;

  // Arată jocul și ascunde meniul
  menu.style.display = 'none';
  game.style.display = 'flex';

  createBoard();
}

/* Creează tabla de joc */
function createBoard() {
  board.innerHTML = '';
  grid = [];

  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;

      const disc = document.createElement('div');
      disc.classList.add('disc');
      cell.appendChild(disc);

      board.appendChild(cell);
      grid[r][c] = 0;
    }
  }

  board.style.pointerEvents = 'auto';
  currentPlayer = 1;
  statusDiv.textContent = `Player 1's Turn`;
}

/* Click pe tabla */
board.addEventListener('click', (e) => {
  const cellClicked = e.target.closest('.cell');
  if (!cellClicked) return;

  const col = +cellClicked.dataset.col;

  // Caută cea mai jos poziție disponibilă
  for (let r = rows - 1; r >= 0; r--) {
    if (grid[r][col] === 0) {
      grid[r][col] = currentPlayer;
      const cell = document.querySelector(`.cell[data-row='${r}'][data-col='${col}']`);
      const disc = cell.querySelector('.disc');

      disc.style.backgroundColor = playerColors[currentPlayer];
      disc.classList.add('falling'); // Adaugă animația de cădere

      // Sunet de click
      const randomClick = clickSounds[Math.floor(Math.random() * clickSounds.length)];
      randomClick.play();

      if (checkWin(r, col)) {
        highlightWinningCells(r, col);
        statusDiv.textContent = `Player ${currentPlayer} wins! 🎉`;
        board.style.pointerEvents = 'none';
        winSound.play();
        triggerConfetti();
      } else if (isBoardFull()) {
        statusDiv.textContent = "It's a Draw! 🤝";
        board.style.pointerEvents = 'none';
        drawSound.play();
      } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        statusDiv.textContent = `Player ${currentPlayer}'s Turn`;
      }
      break;
    }
  }
});

/* Verifică dacă sunt 4 consecutive */
function checkWin(row, col) {
  return (
    checkDirection(row, col, -1, 0) + checkDirection(row, col, 1, 0) > 2 || // Vertical
    checkDirection(row, col, 0, -1) + checkDirection(row, col, 0, 1) > 2 || // Orizontal
    checkDirection(row, col, -1, -1) + checkDirection(row, col, 1, 1) > 2 || // Diagonal \
    checkDirection(row, col, -1, 1) + checkDirection(row, col, 1, -1) > 2    // Diagonal /
  );
}

/* Numără piese consecutive într-o direcție */
function checkDirection(row, col, rowDir, colDir) {
  let count = 0;
  let r = row + rowDir;
  let c = col + colDir;

  while (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] === currentPlayer) {
    count++;
    r += rowDir;
    c += colDir;
  }
  return count;
}

/* Evidențiază piesele câștigătoare */
function highlightWinningCells(row, col) {
  highlightDirection(row, col, -1, 0);
  highlightDirection(row, col, 1, 0);
  highlightDirection(row, col, 0, -1);
  highlightDirection(row, col, 0, 1);
  highlightDirection(row, col, -1, -1);
  highlightDirection(row, col, 1, 1);
  highlightDirection(row, col, -1, 1);
  highlightDirection(row, col, 1, -1);

  const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
  if (cell) cell.classList.add('winner');
}

function highlightDirection(row, col, rowDir, colDir) {
  let r = row + rowDir;
  let c = col + colDir;
  let count = 0;

  while (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] === currentPlayer && count < 3) {
    const cell = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
    if (cell) cell.classList.add('winner');
    r += rowDir;
    c += colDir;
    count++;
  }
}

/* Verifică dacă tabla este plină */
function isBoardFull() {
  return grid.every(row => row.every(cell => cell !== 0));
}

/* Restart joc */
function restartGame() {
  menu.style.display = 'flex';
  game.style.display = 'none';
}

/* Confetti la câștig */
function triggerConfetti() {
  for (let i = 0; i < 150; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '5px';
    confetti.style.height = '5px';
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = `${Math.random() * 100}%`;
    confetti.style.opacity = '0';
    confetti.style.transition = 'opacity 1s ease-out';
    document.body.appendChild(confetti);
    setTimeout(() => {
      confetti.style.opacity = '1';
      confetti.style.top = `${Math.random() * 100 + 50}%`;
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.transition = 'all 2s ease-out';
    }, 10);
    setTimeout(() => confetti.remove(), 3000);
  }
}