/* 
   - have a pop up window at the end of the game to show the final socre - modal

   - abra pokemon - special character, show up at the last 2s, displaytime really fast
   - track what user has caught, and number of character
   - restructure 
*/

const characters = [
  {
    name: "pikachu",
    displayTimeInSeconds: 2,
    score: 1,
  },
  {
    name: "psyduck",
    displayTimeInSeconds: 3,
    score: 1,
  },
  {
    name: "eevee",
    displayTimeInSeconds: 1,
    score: 2,
  },
  {
    name: "bomb",
    displayTimeInSeconds: 2,
    score: -1,
  },
];

class Character {
  constructor(name, displayTimeInSeconds, score) {
    this.name = name;
    this.displayTimeInSeconds = displayTimeInSeconds;
    this.score = score;
  }
}

class Hole {
  constructor(num) {
    this.isDisplaying = false;
    this.img = document.querySelector(`.hole${num} > .character`);
    this.clickFunction = null;
  }

  display(character, game) {
    if (this.isDisplaying) {
      return;
    }
    this.img.removeAttribute("hidden");
    this.img.setAttribute("src", `images/${character.name}.png`);

    this.clickFunction = (e) => {
      e.preventDefault();
      game.trackScore(character.score);
      this.img.removeEventListener("click", this.clickFunction);
      this.img.setAttribute("hidden", true);
      clearTimeout(clearImg);
    };

    this.img.addEventListener("click", this.clickFunction);
    this.isDisplaying = true;

    const clearImg = setTimeout(() => {
      this.clearImg();
    }, `${character.displayTimeInSeconds}000`);
  }

  clearImg() {
    this.img.setAttribute("hidden", true);
    this.isDisplaying = false;
    this.img.removeEventListener("click", this.clickFunction);
  }
}

class Game {
  constructor() {
    this.gameScore = 0;
    this.gameTime = 10;
    this.timer = null;
    this.character = null;
    this.holes = new Array(18).fill().map((_, index) => new Hole(index));

    this.startGame();
  }

  createCharacter() {
    const instantiate = setInterval(() => {
      if (this.gameTime === 0) {
        clearInterval(instantiate);
        return;
      }

      for (let character of characters) {
        const test = new Character(
          character.name,
          character.displayTimeInSeconds,
          character.score
        );
        this.showCharacter(test);
      }
    }, 1000);
  }

  showCharacter(character) {
    const randomNumber = Math.floor(Math.random() * 18);
    const hole = this.holes[randomNumber];
    hole.display(character, this);
  }

  countDown() {
    // make sure only one timer running at a time
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.gameTime--;
      document.querySelector(".time").innerText = this.gameTime;
      if (this.gameTime === 0) {
        clearInterval(this.timer);
        this.gameOver();
      }
    }, 1000);
  }

  startGame() {
    document.querySelector(".score").innerText = 0;
    this.countDown();
    this.createCharacter();
  }

  trackScore(score) {
    this.gameScore += score;
    document.querySelector(".score").innerText = this.gameScore;
  }

  gameOver() {
    button.disabled = false;
    this.holes.forEach((hole) => hole.clearImg());

    // show final socre on the screen
  }
}

const button = document.querySelector("button");
button.addEventListener("click", (e) => {
  e.preventDefault();

  button.disabled = true;
  new Game();
});
