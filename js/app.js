/* 
   - abra pokemon - special character, show up at the last 2s, displaytime really fast
   - restructure 
*/

const availableCharacters = [
  {
    name: "pikachu",
    displayTimeInSeconds: 2,
    score: 1,
  },
  {
    name: "charmander",
    displayTimeInSeconds: 2,
    score: 2,
  },
  {
    name: "squirtle",
    displayTimeInSeconds: 1,
    score: 1,
  },
  {
    name: "bulbasaur",
    displayTimeInSeconds: 1,
    score: 2,
  },
  {
    name: "bomb",
    displayTimeInSeconds: 2,
    score: -1,
  },
  {
    name: "abra",
    displayTimeInSeconds: 0.77,
    score: 3,
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
      game.trackScore(character.score, character.name);
      game.showPoints(character.score);
      this.clearImg();
      clearTimeout(clearImg);
    };

    this.img.addEventListener("click", this.clickFunction);
    this.isDisplaying = true;

    const clearImg = setTimeout(() => {
      this.clearImg();
    }, character.displayTimeInSeconds * 1000);
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
    this.gameTime = 30;
    this.bonusShowTime = 10;
    this.timer = null;
    this.character = null;
    this.holes = new Array(18).fill().map((_, index) => new Hole(index));
    this.totalCaughtCharacters = {};
    availableCharacters.forEach(
      (char) => (this.totalCaughtCharacters[char.name] = 0)
    );

    this.startGame();
  }

  createCharacter() {
    const instantiate = setInterval(() => {
      if (this.gameTime === 0) {
        clearInterval(instantiate);
        return;
      }
      for (let character of availableCharacters) {
        const test = new Character(
          character.name,
          character.displayTimeInSeconds,
          character.score
        );

        if (
          (this.gameTime <= this.bonusShowTime && character.name === "abra") ||
          (this.gameTime > this.bonusShowTime && character.name !== "abra")
        ) {
          this.showCharacter(test);
        }
      }
    }, 700);
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

    const displayTime = document.querySelector(".time");

    this.timer = setInterval(() => {
      this.gameTime--;
      displayTime.innerText = this.gameTime;
      if (this.gameTime === this.bonusShowTime) {
        displayTime.style.color = "red";
      }

      if (this.gameTime === 0) {
        clearInterval(this.timer);
        displayTime.style.color = "black";
        this.gameOver();
      }
    }, 1000);
  }

  startGame() {
    document.querySelector(".score").innerText = 0;
    this.countDown();
    this.createCharacter();
  }

  trackScore(score, characterName) {
    this.gameScore += score;
    document.querySelector(".score").innerText = this.gameScore;

    this.totalCaughtCharacters[characterName]++;
  }

  showPoints(score) {
    const showPoints = document.querySelector(".points");
    showPoints.removeAttribute("hidden");
    showPoints.setAttribute("src", `./images/${score}.png`);

    setTimeout(() => {
      showPoints.setAttribute("hidden", true);
    }, 400);
  }

  gameOver() {
    button.disabled = false;
    this.holes.forEach((hole) => hole.clearImg());
    this.showModal();
  }

  showModal() {
    document.querySelector(".finalScore").innerText = this.gameScore;

    const message = Object.entries(this.totalCaughtCharacters).reduce(
      (accu, [key, value]) => {
        accu += `${key}: ${value} </br>`;
        return accu;
      },
      ""
    );

    document.querySelector(".scoreDetails").innerHTML = message;

    const myModal = new bootstrap.Modal(document.querySelector(".modal"), {
      keyboard: false,
    });
    myModal.show();
  }
}

const button = document.querySelector(".gameButton");
button.addEventListener("click", (e) => {
  e.preventDefault();

  button.disabled = true;
  new Game();
});
