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
    this.holeCircle = document.querySelector(`.hole${num}`);
    this.clickFunction = null;
  }

  display(character, game) {
    if (this.isDisplaying) {
      return;
    }

    this._showCharacterInHole(character.name);
    this._setClickFunction(character, game);
    this.img.addEventListener("click", this.clickFunction);
    this.isDisplaying = true;
    this._clearImgTimeout(character.displayTimeInSeconds);
  }

  _setClickFunction(character, game) {
    this.clickFunction = (e) => {
      e.preventDefault();
      this.holeCircle.style.border = "7px solid gold";
      game.trackScore(character.score, character.name);
      game.showPoints(character.score);

      // clear character image on click
      this._clearImg();
      clearTimeout(this._clearImgTimeout(character.displayTimeInSeconds));

      this._clearCircle();
    };
  }

  _showCharacterInHole(characterName) {
    this.img.removeAttribute("hidden");
    this.img.setAttribute("src", `images/${characterName}.png`);
  }

  _clearCircle() {
    setTimeout(() => {
      this.holeCircle.style.border = "";
    }, 200);
  }

  _clearImg() {
    this.img.setAttribute("hidden", true);
    this.isDisplaying = false;
    this.img.removeEventListener("click", this.clickFunction);
  }

  // clear character image after their display time
  _clearImgTimeout(characterDisplayTimeInSeconds) {
    setTimeout(() => {
      this._clearImg();
    }, characterDisplayTimeInSeconds * 1000);
  }
}

class Game {
  constructor() {
    this.gameScore = 0;
    this.gameTimeLeft = 30;
    this.bonusShowTime = 10;
    this.timer = null;
    this.character = null;
    this.holes = new Array(18).fill().map((_, index) => new Hole(index));
    this.totalCaughtCharacters = availableCharacters.reduce((acc, curr) => {
      acc[curr.name] = 0;
      return acc;
    }, {});

    this.startGame();
  }

  createCharacter() {
    const instantiate = setInterval(() => {
      if (this.gameTimeLeft === 0) {
        clearInterval(instantiate);
        return;
      }
      for (let character of availableCharacters) {
        const char = new Character(
          character.name,
          character.displayTimeInSeconds,
          character.score
        );

        // bonus time; only show abra during the bonus time
        if (
          (this.gameTimeLeft <= this.bonusShowTime &&
            character.name === "abra") ||
          (this.gameTimeLeft > this.bonusShowTime && character.name !== "abra")
        ) {
          this.showCharacter(char);
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
      this.gameTimeLeft--;
      displayTime.innerText = this.gameTimeLeft;
      if (this.gameTimeLeft === this.bonusShowTime) {
        displayTime.style.color = "red";
      }

      if (this.gameTimeLeft === 0) {
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
    this.holes.forEach((hole) => hole._clearImg());
    this.showModal();
  }

  showModal() {
    document.querySelector(".finalScore").innerText = this.gameScore;

    // create message from totalCaughtCharacters object
    const message = Object.entries(this.totalCaughtCharacters).reduce(
      (accu, [key, value]) => {
        accu += `${key}: ${value} </br>`;
        return accu;
      },
      ""
    );

    document.querySelector(".scoreDetails").innerHTML = message;

    const myModal = new bootstrap.Modal(document.querySelector(".modal"));
    myModal.show();
  }
}

const button = document.querySelector(".gameButton");
button.addEventListener("click", (e) => {
  e.preventDefault();

  button.disabled = true;
  new Game();
});
