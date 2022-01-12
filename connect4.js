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


function mainGame (e) {
e.preventDefault();
  if (wide.value >= 4 && high.value >= 4 && wide.value <= 20 && high.value <= 20) {
  startBtn.style.pointerEvents = 'none';

  const WIDTH = wide.value;
  const HEIGHT = high.value;

  let currPlayer = 1; // active player: 1 or 2
  let board = []; // array of rows, each row is array of cells  (board[y][x])

  /** makeBoard: create in-JS board structure:
   *    board = array of rows, each row is array of cells  (board[y][x])
   */

  function makeBoard() {
    
    while (board.length <= HEIGHT - 1) {
      board.push(Array.from({length: WIDTH}));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  function makeHtmlBoard() {
    //my mentor showed me that it was better to create the elements dynamically so that I could reset them later
    const htmlBoard = document.createElement('table');
    const divGame = document.getElementById('game');
    htmlBoard.setAttribute('id', 'board');
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
    divGame.append(htmlBoard); 
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
   
    board[y][x] = currPlayer; //I don't understand why it works, lol...
    placeInTable(y, x);

    // check for win
    if (checkForWin()) {
      return endGame(`player ${currPlayer} won!`);
      
    }

    // check for tie
    // TODO: check if all cells in board are filled; if so call, call endGame
    
    //can't figure this out. This should work but it doesn't
    // my mentor figured out that my while loop was the issue. I had it set for <= HEIGHT but it needed to be HEIGHT - 1
    if (board.every(n => n.every(c => c))) { 
          return endGame('Nice one, losers');
        }
    

    // switch players
    
    currPlayer === 1 ? currPlayer ++ : currPlayer --;
  }

  //my mentor helped me figure this out. it lets you clear pieces to start a new game
const clearBoard = document.querySelector('#clear'); 
clearBoard.addEventListener('click', (e) => {
  e.preventDefault();
  const tableBoard = document.getElementById('board');
  tableBoard.remove();

  makeBoard()
  makeHtmlBoard()

  console.log(board)

  for(let h=0; h < HEIGHT; h++){
    for(let w=0; w < WIDTH; w++){
      if(typeof(board[h][w]) !== 'undefined'){
        board[h][w] = undefined
      }
    }
  }
  
//this was my code. I asked my mentor to help me figure out how ot make it work, because it was only removing the HTML divs, but not resetting the board array
// const clearBoard = document.querySelector('#clear'); 
// clearBoard.addEventListener('click', (e) => {
//   e.preventDefault();
//   const pieces = document.querySelectorAll('.piece');

//   for (let piece of pieces){
//     piece.remove();
//   }   
});
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

    for (let y = 0; y < HEIGHT; y++) //loop through rows 
    {
      for (let x = 0; x < WIDTH; x++) //loop through columns inside of rows 
      { //these put 4 cells together horizontally, vertically, AND diagonally
        let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true; // this checks to see if there are 4 in a row, and then the _win function takes that input and returns true if they are all 4 the same. 
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