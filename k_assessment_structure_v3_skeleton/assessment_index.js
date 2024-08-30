const prompt = require("prompt-sync")({ sigint: true });

// Game elements/assets constants
const GRASS = "░";
const HOLE = "O";
const CARROT = "^";
const PLAYER = "*";

// WIN / LOSE / OUT / QUIT messages constants
const WIN = "Congratulations, you have found the carrot!"; // TODO: customise message when player wins
const LOST = "You stepped on a hole. Game over!"; // TODO: customise message when player lose
const OUT = "You have went out of bounds. Game over!"; // TODO: customise message when player is out of bounds (lose)
const QUIT = "You have quit the game."; // TODO: customise message when player quits

const ROWS = 8; // the game map will have 8 rows
const COLS = 8; // the game map will have 5 cols
const PERCENT = 0.2; // % of holes for the map

class Field {
  // TODO: create the constructor
  constructor(field = [[]]) {
    this.field = field;
    this.gamePlay = false;
    this.currentLoc = [0, 0];
    this.currentGround = GRASS;
  }

  static welcomeMsg(msg) {
    // static Method to show game's welcome message
    console.log(msg);
  }

  static generateField(rows, cols, percentage) {
    const map = [[]];

    for (let i = 0; i < rows; i++) {
      // create the map with 8 rows
      map[i] = []; // each row will have 5 cols
      for (let j = 0; j < cols; j++) {
        map[i][j] = Math.random() > percentage ? GRASS : HOLE; // per col in each row, we generate grass(80%)/hole(20%)
      }
    }

    return map;
  }

  printField() {
    // print the game field (used to update during gameplay)
    this.field.forEach((element) => {
      console.log(element.join(""));
    });
  }
  plantCarrot() {
    const x = Math.floor(Math.random() * (ROWS - 1)) + 1;
    const y = Math.floor(Math.random() * (COLS - 1)) + 1;
    this.field[x][y] = CARROT;
  }

  verifyLoc(loc) {
    //Check if current location is a HOLE or CARROT
    switch (this.field[loc[0]][loc[1]]) {
      case HOLE:
        console.log(LOST);
        this.endGame();
        break;
      case CARROT:
        console.log(WIN);
        this.endGame();
        break;
    }
  }

  updateGame(input) {
    const userInput = String(input).toLowerCase();
    let originalLoc = [this.currentLoc[0], this.currentLoc[1]];
    switch (userInput) {
      case "u":
        if (this.currentLoc[0] > 0) this.currentLoc[0] -= 1;
        break;
      case "d":
        if (this.currentLoc[0] < ROWS - 1) this.currentLoc[0] += 1;
        break;
      case "l":
        if (this.currentLoc[1] > 0) this.currentLoc[1] -= 1;
        break;
      case "r":
        if (this.currentLoc[1] < COLS - 1) this.currentLoc[1] += 1;
        break;
    }

    if (
      //if location did not change, all switch cases failed meaning out of bounds
      originalLoc[0] === this.currentLoc[0] &&
      originalLoc[1] === this.currentLoc[1]
    ) {
      console.log(OUT);
      this.endGame();
    }

    this.verifyLoc(this.currentLoc); //Check for win/lose case and quit the game
    this.field[originalLoc[0]][originalLoc[1]] = GRASS; // Since player have not won/lost, update original player pos to GRASS
    this.field[this.currentLoc[0]][this.currentLoc[1]] = PLAYER; // Update new position to PLAYER
  }

  startGame() {
    this.gamePlay = true;
    this.field[0][0] = PLAYER;
    this.plantCarrot();
    while (this.gamePlay) {
      this.printField();
      console.log("(u)p, (d)own, (l)eft, (r)ight, (q)uit");
      const input = prompt("which way: ");
      switch (input.toLowerCase()) {
        case "u":
        case "d":
        case "l":
        case "r":
          this.updateGame(input);
          break;
        case "q":
          console.log(QUIT);
          this.endGame();
          break;
        default:
          console.log("Invalid input");
          break;
      }
    }
  }

  endGame() {
    this.gamePlay = false; // set property gamePlay to false
    process.exit();
  }

  quitGame() {
    console.log(QUIT);
    this.endGame();
  }
}

// Instantiate a new instance of Field Class
const createField = Field.generateField(ROWS, COLS, PERCENT);
const gameField = new Field(createField);
// console.log(createField)
Field.welcomeMsg(
  "Welcome to Find Your Hat!\n**************************************************\n"
);

gameField.startGame();
gameField.printField(); // to test only
