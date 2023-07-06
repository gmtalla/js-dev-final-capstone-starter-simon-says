/**
 * DOM SELECTORS
 */

const startButton = document.querySelector(".js-start-button");
const statusSpan = document.querySelector(".js-status"); 
const heading = document.querySelector(".js-heading"); 
const padContainer = document.querySelector(".js-pad-container"); 
const difficultyContainer = document.querySelector('.js-difficulty');

/**
* VARIABLES
*/
let computerSequence = []; // track the computer-generated sequence of pad presses
let playerSequence = []; // track the player-generated sequence of pad presses
let maxRoundCount = 0; // the max number of rounds, varies with the chosen level
let roundCount = 0; // track the number of rounds that have been played so far

/**
* US-01.5
* The `pads` array contains an array of pad objects.
*/

const pads = [
 {
   color: "red",
   selector: document.querySelector(".js-pad-red"),
   sound: new Audio("../assets/simon-says-sound-1.mp3"),
 },
 {
  color: "green",
  selector: document.querySelector(".js-pad-green"),
  sound: new Audio("../assets/simon-says-sound-2.mp3"),
},
{
  color: "blue",
  selector: document.querySelector(".js-pad-blue"),
  sound: new Audio("../assets/simon-says-sound-3.mp3"),
},
{
  color: "yellow",
  selector: document.querySelector(".js-pad-yellow"),
  sound: new Audio("../assets/simon-says-sound-4.mp3"),
},
];

/**
* EVENT LISTENERS
*/
padContainer.addEventListener("click", padHandler);
startButton.addEventListener("click", startButtonHandler);

/**
* EVENT HANDLERS
*/

/**
* US-02.2
* Called when the start button is clicked.
*/
function startButtonHandler() {
  setLevel();
  roundCount++;
  startButton.classList.add('hidden');
  difficultyContainer.classList.add('hidden');
  statusSpan.classList.remove('hidden');
  difficultyContainer.classList.add('hidden');
  playComputerTurn();
  return { startButton, statusSpan };
}

/**
* US-04.2
* Called when one of the pads is clicked.
*
*/
function padHandler(event) {
  const { color } = event.target.dataset;
  if (!color) return;
  let pad = pads.find(pad => pad.color == color);
  pad.sound.currentTime = 0;
  pad.sound.play();
  checkPress(color);
  return color;
}

/** 
* HELPER FUNCTIONS
*/

/**
 * US-02.1
* Sets the level of the game given a `level` parameter.
* Returns the length of the sequence for a valid `level` parameter (1 - 4) or an error message otherwise.
*
* Each skill level will require the player to complete a different number of rounds, as follows:
* Skill level 1: 8 rounds
* Skill level 2: 14 rounds
* Skill level 3: 20 rounds
* Skill level 4: 31 rounds
*/
function setLevel(level) {
  level = Number(document.querySelector('input[name="difficulty"]:checked').value);
  let rounds = [8,8,14,20,31]
  maxRoundCount = rounds[level];
  if (level > 4) {
    return "Please enter level 1, 2, 3, or 4";
  } else {
    return rounds[level];
  }
}

/**
* US-03.1
* Returns a randomly selected item from a given array.
*/
function getRandomItem(collection) {
 if (collection.length === 0) return null;
 const randomIndex = Math.floor(Math.random() * collection.length);
 return collection[randomIndex];
}

/**
 * US-03.2
* Sets the status text of a given HTML element with a given a message
*/
function setText(element, text) {
 element.textContent = text
 //element.innerText = text
 return element;
}

/**
* US-03.3
* Activates a pad of a given color by playing its sound and light
*/
function activatePad(color) {
  let pad = pads.find(pad => pad.color == color);
  pad.selector.classList.add('activated');
  pad.sound.currentTime = 0;
  pad.sound.play();
  setTimeout(() => pad.selector.classList.remove('activated'), 500);
}

/**
* US-03.4
* Activates a sequence of colors passed as an array to the function
*/

function activatePads(sequence) {
  let delay = 600;
  sequence.forEach(color => {
    setTimeout(() => activatePad(color), delay);
    delay += 600;
  })
}

/**
* US-03.5
* Allows the computer to play its turn.
*
*/
function playComputerTurn() {
  padContainer.classList.add('unclickable');
  setText(statusSpan, "The computer's turn...");
  setText(heading, `Round ${roundCount} of ${maxRoundCount}`);
  playerSequence = [];

  computerSequence.push(getRandomItem(['red', 'green', 'blue', 'yellow']));
  activatePads(computerSequence);

  setTimeout(() => playHumanTurn(roundCount), roundCount * 600 + 500); // 5
}

/**
* US-04.1
* Allows the player to play their turn.
*/
function playHumanTurn() {
  padContainer.classList.remove('unclickable');
  let remainingPresses = computerSequence.length - playerSequence.length;
  if (playerSequence.length == 0) {
    setText(statusSpan, "Player's turn...");
  } else if (remainingPresses == 1) {
    setText(statusSpan, `1 press remaining`);
  } else {
    setText(statusSpan, `${remainingPresses} presses remaining`);
  }
}

/**
* US-04.3
* Checks the player's selection every time the player presses on a pad during
* the player's turn
*
* US-04.3.1. Add the `color` variable to the end of the `playerSequence` array
*
* US-04.3.2. Store the index of the `color` variable in a variable called `index`
*
* US-04.3.3. Calculate how many presses are left in the round using
* `computerSequence.length - playerSequence.length` and store the result in
* a variable called `remainingPresses`
*      remainingPresses = computerSequence.length - playerSequence.length
* US-04.3.4. Set the status to let the player know how many presses are left in the round
*      $("span").text("${remainingPresses} presses left in the round  ...")
* US-04.3.5. Check whether the elements at the `index` position in `computerSequence`
* and `playerSequence` match. If they don't match, it means the player made
* a wrong turn, so call `resetGame()` with a failure message and exit the function
*      
* US-04.2.6. If there are no presses left (i.e., `remainingPresses === 0`), it means the round
* is over, so call `checkRound()` instead to check the results of the round
*   if (remainingPresses === 0) { }
*/
function checkPress(color) {
  playerSequence.push(color);
  let index = playerSequence.length - 1;
  let remainingPresses = computerSequence.length - playerSequence.length;
  if (remainingPresses == 1) {
    setText(statusSpan, `1 press remaining`);
  } else {
    setText(statusSpan, `${remainingPresses} presses remaining`)
  }
  if (playerSequence[index] != computerSequence[index]) {
    resetGame("Incorrect sequence!");
  } else {
    if (remainingPresses == 0) checkRound();
  }
}
/**
* US-04.4
* Checks each round to see if the player has completed all the rounds of the game * or advance to the next round if the game has not finished.
*
* US-04.4.1. If the length of the `playerSequence` array matches `maxRoundCount`, it means that
* the player has completed all the rounds so call `resetGame()` with a success message
*
* US-04.4.2. Else, the `roundCount` variable is incremented by 1 and the `playerSequence` array
* is reset to an empty array.
* - And the status text is updated to let the player know to keep playing (e.g., "Nice! Keep going!")
* - And `playComputerTurn()` is called after 1000 ms (using setTimeout()). The delay
* is to allow the user to see the success message. Otherwise, it will not appear at
* all because it will get overwritten.
*
*/
function checkRound() {
  if (playerSequence.length == maxRoundCount) {
    resetGame("You won!");
  } else {
    roundCount++;
    setText(statusSpan, "Nice! Keep going!");
    setTimeout(playComputerTurn, 1000);
  }
}

/**
* US-05
* Resets the game. Called when either the player makes a mistake or wins the game.
*
* 1. Reset `computerSequence` to an empty array
*
* 2. Reset `playerSequence` to an empty array
*
* 3. Reset `roundCount` to an empty array
*/
function resetGame(text) {
  alert(text);
  computerSequence = [];
  playerSequence = [];
  roundCount = 0;
  //playerWins = 0;
  //computerWins = 0;

  /**if (text.includes("won")) {
    playerWins++;
  } else {
    computerWins++;
  }*/
  setText(heading, "Simon Says");
  //setText(heading, `${text}\nYou ${playerWins} vs CPU ${computerWins}`);
  setText(startButton, "PLAY AGAIN")
  statusSpan.classList.add("hidden");
  startButton.classList.remove("hidden");
  padContainer.classList.add("unclickable");
  difficultyContainer.classList.remove("hidden");
}

/**
* Please do not modify the code below.
* Used for testing purposes.
*
*/
window.statusSpan = statusSpan;
window.heading = heading;
window.padContainer = padContainer;
window.pads = pads;
window.computerSequence = computerSequence;
window.playerSequence = playerSequence;
window.maxRoundCount = maxRoundCount;
window.roundCount = roundCount;
window.startButtonHandler = startButtonHandler;
window.padHandler = padHandler;
window.setLevel = setLevel;
window.getRandomItem = getRandomItem;
window.setText = setText;
window.activatePad = activatePad;
window.activatePads = activatePads;
window.playComputerTurn = playComputerTurn;
window.playHumanTurn = playHumanTurn;
window.checkPress = checkPress;
window.checkRound = checkRound;
window.resetGame = resetGame;