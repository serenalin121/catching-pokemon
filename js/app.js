/* 
   create character class and Game Class
        character class:
            - name, displayTime, score v
            - if got caught, will disappear
        game class:
            - show characters randomly,
            - track score
            - track time
*/

const pokemons = [
  {
    name: "pikachu",
    displayTime: 2,
    score: 1,
  },
  {
    name: "psyduck",
    displayTime: 4,
    score: 1,
  },
  {
    name: "eevee",
    displayTime: 1,
    score: 2,
  },
];

class Character {
  constructor(name, displayTime, score) {
    this.name = name;
    this.displayTime = displayTime;
    this.hasCaught = false;
    this.score = score;
  }
}

class Game {
  constructor() {
    this.score = 0;
    this.gameTime = 10;
    this.timer = null;
    this.startGame();
  }

  showCharacter() {
    const character = setInterval(() => {
      for (let pokemon of pokemons) {
        const test = new Character(
          pokemon.name,
          pokemon.displayTime,
          pokemon.score
        );
        console.log(test);
      }
      if (this.gameTime === 0) {
        clearInterval(character);
        return;
      }
    }, 1000);
  }

  countDown() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.gameTime--;
      console.log(this.gameTime);

      if (this.gameTime === 0) {
        clearInterval(this.timer);
        this.gameOver();
      }
    }, 1000);
  }

  startGame() {
    this.countDown();
    this.showCharacter();
    // disable start game button
  }

  gameOver() {
    button.disabled = false;
    // show final socre on the screen
  }
}

const button = document.querySelector("button");
button.addEventListener("click", (e) => {
  e.preventDefault();

  button.disabled = true;
  new Game();
});
