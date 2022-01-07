/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
let wide = document.querySelector('input[name="wide"]');
let high = document.querySelector('input[name="high"]');

const startBtn = document.querySelector('#start');
startBtn.addEventListener('click', mainGame);
const resetBtn = document.querySelector('#reset');
resetBtn.addEventListener('click', () => location.reload());
const clearBoard = document.querySelector('#clear');
clearBoard.addEventListener('click', (e) => {
  e.preventDefault();
  const pieces = document.querySelectorAll('.piece');
  console.log(pieces);
  for (let piece of pieces){
    piece.remove();
  }
});

function mainGame (e) {
e.preventDefault();
  if (wide.value >= 4 && high.value >= 4 && wide.value <= 20 && high.value <= 20) {
  startBtn.style.pointerEvents = 'none';
  

  let WIDTH = wide.value;
  let HEIGHT = high.value;

  let currPlayer = 1; // active player: 1 or 2
  let board = []; // array of rows, each row is array of cells  (board[y][x])

  /** makeBoard: create in-JS board structure:
   *    board = array of rows, each row is array of cells  (board[y][x])
   */

  function makeBoard() {
    
    while (board.length <= HEIGHT) {
      board.push(Array.from({length: WIDTH}));
    }
    console.log(board);
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  function makeHtmlBoard() {
    
    const htmlBoard = document.getElementById('board');
    // create top row and add click event listener to the cells
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", handleClick);

    for (let x = 0; x < WIDTH; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    htmlBoard.append(top);

    // create next rows up to the value of height and then create the ceels and give them an id that will be the row - column
    for (let y = 0; y < HEIGHT; y++) {
      const row = document.createElement("tr");
      for (var x = 0; x < WIDTH; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }
      htmlBoard.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  function findSpotForCol(x) {
    // I had to look at the solution for this, but I was actually reall really close... I literally had this exact code but I had it returning y[x] instead of y
    for (let i = HEIGHT - 1; i >= 0; i--) {
      if (!board[i][x]) {
        return i;
      }
    } return null;
    
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  function placeInTable(y, x) {
    
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`player${currPlayer}`);
    const cell = document.getElementById(`${y}-${x}`);
    cell.appendChild(piece);
  }

  /** endGame: announce game end */

  function endGame(msg) {
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */

  function handleClick(evt) {
    // get x from ID of clicked cell
    let x = +evt.target.id;
    
    // get next spot in column (if none, ignore click)
    let y = findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
   
    board[y][x] = currPlayer; //I got this to work but I don't understand why it works, lol...
    placeInTable(y, x);

    // check for win
    if (checkForWin()) {
      return endGame(`Player ${currPlayer} won!`);
      
    }

    // check for tie
    // TODO: check if all cells in board are filled; if so call, call endGame
    
    
    if (board.every(n => n.every(c => c))) { 
          return endGame('Nice one, losers');
        }
    

    // switch players
    
    currPlayer === 1 ? currPlayer ++ : currPlayer --;
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  function checkForWin() {
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < HEIGHT &&
          x >= 0 &&
          x < WIDTH &&
          board[y][x] === currPlayer
      );
    }

    // TODO: read and understand this code. Add comments to help you.

    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }


  makeBoard();
  makeHtmlBoard();

  wide.value = '';
  high.value = '';
  }
  else if(wide.value === '' || high.value === '') {
    alert('Please enter width and height');
  }
  else if (wide.value < 4 || high.value < 4){
    alert('Please enter a width and height greater than 4');
    wide.value = '';
    high.value = '';
  }
  else if (wide.value > 20 || high.value > 20){
    alert('Please enter a width and height of 20 or less');
    wide.value = '';
    high.value = '';
  }
}