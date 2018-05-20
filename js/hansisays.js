var greenSound, redSound, blueSound, yellowSound, errorSound;

var score = 0;
var highscore = 0;

$(document).ready(function () {

    loadSounds();

    $('.colorbutton').addClass('pressed');
});



function loadSounds() {
    greenSound = new Howl({
        src: ['sounds/green.mp3','sounds/green.ogg']
    });

    redSound = new Howl({
        src: ['sounds/red.mp3','sounds/red.ogg']
    });

    blueSound = new Howl({
        src: ['sounds/blue.mp3','sounds/blue.ogg']
    });

    yellowSound = new Howl({
        src: ['sounds/yellow.mp3','sounds/yellow.ogg']
    });

    errorSound = new Howl({
        src: ['sounds/error.mp3','sounds/error.ogg']
    });
}



function copyArray(input) {
    var copy = input.slice();
    return copy;
}
var parsed = {
    status:"",
    sequence:[],
}

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


var counter = 0;
function printArray() {
    if(counter < parsed.sequence.length) {
        var tempSound = parsed.sequence[counter];
        playSound(tempSound);
        counter++;
        setTimeout(printArray, 3000);
    } else {
        counter = 0;
    }
}






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






function newGame() {
    request();
    printArray();
}
