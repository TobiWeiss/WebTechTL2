var greenSound, redSound, blueSound, yellowSound, errorSound;

var score = 0;
var highscore = 0;
/*Array to store user inputs*/
var playerGame = [];
/*Object to store returned Values from nextColor.php*/
var parsed = {
    status: "",
    sequence: [],
};

$(document).ready(function () {

    loadSounds();

    $('.colorbutton').addClass('pressed');
});

/*Function to start a New Game
  Array containing the sequence of colors gets emptied & score is set to 0
  request() sends the empty Array to nextColor.php to get the first two colors
  blockButtons() disables inputs from the user
  printArray() displays the sequence of colors (setTimeout necessary to ensure functionality)*/
function newGame() {
    $('.colorbutton').removeClass('pressed');
    parsed.sequence = [];
    score = 0;
    document.getElementById("score").innerHTML = score.toString();
    request();
    blockButtons();
    setTimeout(printArray, 3000);
}

/*Function to continue playing once the user pressed the right sequence of colors
  request() sends the  Array to nextColor.php to get the next color
  blockButtons() disables inputs from the user
  printArray() displays the sequence of colors (setTimeout necessary to ensure functionality)*/
function newRound() {
    request();
    blockButtons();
    setTimeout(printArray, 3000);
}


function loadSounds() {
    greenSound = new Howl({
        src: ['sounds/green.mp3', 'sounds/green.ogg']
    });

    redSound = new Howl({
        src: ['sounds/red.mp3', 'sounds/red.ogg']
    });

    blueSound = new Howl({
        src: ['sounds/blue.mp3', 'sounds/blue.ogg']
    });

    yellowSound = new Howl({
        src: ['sounds/yellow.mp3', 'sounds/yellow.ogg']
    });

    errorSound = new Howl({
        src: ['sounds/error.mp3', 'sounds/error.ogg']
    });
}

/*Object to store returned Values from nextColor.php*/
var parsed = {
    status: "",
    sequence: [],
};

/*Function to play Sound according to input */
function playSound(input) {
    if (input == "red") {
        redSound.play();
    }
    else if (input == "blue") {
        blueSound.play();
    }
    else if (input == "green") {
        greenSound.play();
    }
    else {
        yellowSound.play();
    }
}

/*Function to block Colors from being clicked, necessary to ensure that the user is not able to press colors after the right sequence
   of colors has been entered
 */
function blockColors() {
    $('#red').off('click');
    $('#blue').off('click');
    $('#green').off('click');
    $('#yellow').off('click');
}

/*Function to block Buttons while sequence of colors is being displayed
 */
function blockButtons() {
    $('#red').off('click');
    $('#blue').off('click');
    $('#green').off('click');
    $('#yellow').off('click');
    document.getElementById("newGameButton").disabled = true;
    document.getElementById("proceedButton").disabled = true;
}

/*Function to allow user inputs when necessary
 */
function freeButtons() {
    $('#red').on('click', function () {
        playerInput(this.id);
    });
    $('#yellow').on('click', function () {
        playerInput(this.id);
    });
    $('#blue').on('click', function () {
        playerInput(this.id);
    });
    $('#green').on('click', function () {
        playerInput(this.id);
    });
    document.getElementById("newGameButton").disabled = false;
}

/*Function to visually display color according to input
 */
function showSequence(input) {
    $('#' + input).addClass('pressed');
    setTimeout(function () {
        $('#' + input).removeClass('pressed')
    }, 300)
}

/*variable to iterate over array containing colors */
var counter = 0;

/*Function to play the sequence received from nextColor.php
  var tempSound is used to store color, then functions to visualize & play corresponding sound is called
  Then function is called again until sequence is played
  Once Sequence is play counter is set to 0 again and inputs from the user are allowed by calling function freeButtons()*/
function printArray() {
    if (counter < parsed.sequence.length) {
        var tempSound = parsed.sequence[counter];
        playSound(tempSound);
        showSequence(tempSound);
        counter++;
        setTimeout(printArray, 1000);
    } else {
        counter = 0;
        freeButtons();
        console.log("Sequenz abgespielt")
    }
}

/*Function to request colors from nextColor.php
 requested values are stored in variable "parsed"*/
function request() {
    var xmlhttp = false;
    try {
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    catch (e) {
        alert("cannot create object");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            parsed = JSON.parse(xmlhttp.responseText);
            console.log(parsed);
        }
    };
    xmlhttp.open("GET", "php/nextColor.php?sequence=" + JSON.stringify(parsed.sequence), true);
    xmlhttp.send();
}


/*Function to collect pressed colors and to compare pressed colors to the relevant part of the sequence requested from nextColor.php */
function playerInput(input) {
    playSound(input);
    showSequence(input);
    playerGame.push(input);
    console.log(input)
    setTimeout(compareInput, 200);
}

/*Function to empty Array containing user inputs*/
function clearPlayer() {
    playerGame = [];
}

/*Function to compare user inputs with sequence requested from nextColor.php
  If user input does not match the sequence, the game stops, color buttons are disabled for further input,
  sequence and playerGame are emptied
  If the user enters the correct sequence, the colors get blocked for further inputs and the button "weiter" gets enabled to continue
  with the next round
  If the reached score is greater than the value of the variable highscore, highscore gets changed*/
function compareInput() {
    if (playerGame[playerGame.length - 1] !== parsed.sequence[playerGame.length - 1]) {
        alert("Schade, falsche Eingabe");
        errorSound.play();
        blockColors();
        $('.colorbutton').addClass('pressed');
        playerGame = [];
        parsed.sequence = [];
    } else {
        if (playerGame.length == parsed.sequence.length) {
            alert("Sehr gut!");
            blockColors();
            score++;
            document.getElementById("score").innerHTML = score.toString();
            if (score > highscore) {
                highscore = score;
                document.getElementById("highscore").innerHTML = highscore.toString();
                clearPlayer();
            } else {
                clearPlayer();
            }
            document.getElementById("proceedButton").disabled = false;
        }
    }
}


