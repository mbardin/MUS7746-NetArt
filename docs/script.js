//Global Variables
let userState = "View";

let possibleNotes = [
    "a",
    "A",
    "b",
    "B",
    "c",
    "C",
    "d",
    "D",
    "e",
    "E",
    "f",
    "F",
    "g",
    "G"
];
let oscTypes = [
    "sine",
    "square",
    "triangle",
    "sawtooth",
    "Sine",
    "Square",
    "Triangle",
    "tri",
    "squ",
    "saw",
    "Sawtooth",
    "tooth"
];

//for the text letter randomizing
let letters = [];
let letterDivs = [];
let letterTimer;
let yStart = [];
let xStart = [];
let accum = 0;


//UI objects
let viewModeScreenText = document.getElementById("viewModeText");
let TypeBox = document.getElementById("textField");
let menuSqu = document.getElementById("mySquare");
let menuCir = document.getElementById("myCircle");
let menuParallel = document.getElementById("myParallel");
let menuTri = document.getElementById("myTri");
let menuLine = document.getElementById("myLine");
let menuDivider = document.getElementById("menuLine");
let redSlider = document.getElementById("rSlide");
let blueSlider = document.getElementById("bSlide");
let greenSlider = document.getElementById("gSlide");
let menu = document.getElementById("hoverMenu");

let defaultFlag = false;

let melody = ["A4", "E4", "D4"]; //starting melody for the synth.
let synth = new Tone.Synth({
    oscillator: {
        type: `sine`
    },
    envelope: {
        attack: 5,
        decay: 0.5,
        sustain: 0.75,
        release: 3
    }
}); //starting synth params

let reverb = new Tone.Reverb(0.4);
let PPDel = new Tone.PingPongDelay(getRandomInt(1, 10), 0.5);
let chorus = new Tone.Chorus(4, 2.5, 0.5); //adjust label
let distort = new Tone.BitCrusher(16);

synth.chain(chorus, distort, reverb, PPDel, Tone.Destination); //audio chain


Tone.loaded().then(() => {
    console.log(Tone);
    Tone.Transport.bpm = 70; //starts transport for melody
    Tone.Transport.start(); //begins transport
    changeAppearance(); //sets default State
});

let starterFlag = 0; //trigger for making a new sequence
function seq() {
    let sequence = new Tone.Sequence(
        function(time, note) {
            synth.triggerAttackRelease(note, 6);
        },
        melody,
        "1n"
    ); //makes a new sequence with contents of melody[] everytime this is called
    if (starterFlag != 0) { //if not first time is called, will stop the sequence, then restart it to let the new notes appear
        sequence.stop();
    }
    sequence.start();
    starterFlag++;
}

function getRandomInt(min, max) { //gives random whole numbers when needed
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function randomColor() { //gives random color when needed
    //generates a random color
    let color = [floor(random(256)), floor(random(256)), floor(random(256))];
    console.log(`This random color is: ${color}`); //displaces most recent random color in console
    return color;
}

function map(inputY, yMin, yMax, xMin, xMax) {
    percent = (inputY - yMin) / (yMax - yMin);
    outputX = percent * (xMax - xMin) + xMin;
    return outputX;
}

//these functions are used to adjust the parameters of the effect chain/sequence melody/synth. will be tied to object values.
function changeVerbTime(val) { //make a mapping function
    let newValue = map(val, 1, 255, 0, 10);
    reverb.decay = newValue;
}

function changeDelayTime(val) {
    let newValue = map(val, 1, 255, 0, 10);
    PPDel.delayTime.exponentialRampToValueAtTime(newValue, "+10");
}

function changeDistortion(val) {
    let newValue = map(val, 1, 255, 1, 16);
    distort.bits.linearRampToValueAtTime(newValue, "+30");
}

function changechorusSpeed(val) {
    let newValue = map(val, 1, 255, 0, 0.99);
    chorus.depth = newValue;
}

function changechorusDepth(val) {
    let newValue = map(val, 1, 255, 0, 0.99);
    chorus.frequency = newValue;
}

let erodeToggle = false; //used to trigger eroding of melody after timer goes off
function erodeMelody() {
    //transitions back to original melody
    if (melody.length > 3 && erodeToggle) {
        //only works if melody has been added to and timer sets the flag
        melody.pop(); //removes last melody from the sequence
        console.log(`a note has been removed from the melody`);
        console.log(`the melody is now: [${melody}]`);
        seq();
        setTimeout(function() {
            erodeMelody();
        }, getRandomInt(10000, 120000)); //randomly calls again a few seconds later to remove another note
    }
}

function defaultFX() { //transitions back to default state after timer has gone off
    if (defaultFlag) {
        reverb.decay = 0.2 //0.2
        PPDel.delayTime.exponentialRampToValueAtTime(0.5, "+30"); //0.5
        PPDel.feedback.exponentialRampToValueAtTime(0.5, "+300"); //0.5
        chorus.frequency.exponentialRampToValueAtTime(1, "+60"); //1
        chorus.depth = 0.1; //0.1
        distort.bits.linearRampToValueAtTime(16, "+600");
        synth.volume.exponentialRampToValueAtTime(0, "+60"); //0
    }
}

let muteToggle = false;
document.querySelector("#mute").addEventListener("click", () => { //has mute button work
    if (muteToggle) {
        louder();
        setTimeout(function() {
            if (defaultFlag != true) {
                defaultFlag = true;
                defaultFX();
                defaultFlag = false;
            }
        }, getRandomInt(10000, 120000));
        muteToggle = false;
    } else {
        shutUp();
        setTimeout(function() {
            if (defaultFlag != true) {
                defaultFlag = true;
                defaultFX();
                defaultFlag = false;
            }
        }, getRandomInt(10000, 120000));
        muteToggle = true;
    }
});

function shutUp() { //mutes and changes button text
    synth.volume.exponentialRampToValueAtTime(-60, "+5");
    document.getElementById("mute").textContent = "UNMUTE";
    //  startTimer();
}

function louder() { //unmutes and changes button text
    synth.volume.exponentialRampToValueAtTime(0, "+5");
    document.getElementById("mute").textContent = "MUTE";
    // startTimer();
}

function addNotes(note) { //adds notes to melody[] when typed into text input
    if (possibleNotes.includes(note)) {
        let oct = getRandomInt(1, 6);
        let newestNote = `${note}${oct}`;
        melody.push(newestNote);
        console.log(`You added the note ${note} to the melody.`);
        console.log(`The melody is now: [${melody}]`);
        seq();
        setTimeout(function() {
            if (defaultFlag != true) {
                defaultFlag = true;
                defaultFX();
                defaultFlag = false;
            }
        }, getRandomInt(10000, 120000));
    }
}

function removeNotes() {
    //removes the last note from the melody
    melody.pop();
    console.log(`You removed a note from the melody.`);
    console.log(`The melody is now: [${melody}]`);
    seq();
    setTimeout(function() {
        if (defaultFlag != true) {
            defaultFlag = true;
            defaultFX();
            defaultFlag = false;
        }
    }, getRandomInt(10000, 120000));
}

function changeSynthOsc(type) { //changes synth type based on text input
    //changes the synth type
    if (oscTypes.includes(type)) {
        synth.oscillator.type = type;
        console.log(`you have set the synth type to ${type}`);
        setTimeout(function() {
            if (defaultFlag != true) {
                defaultFlag = true;
                defaultFX();
                defaultFlag = false;
            }
        }, getRandomInt(10000, 120000));
    } else {
        console.log(
            `Unable to change synth type to ${type}. Please select from: [${oscTypes}`
        );
    }
}

//displays the text on the screen and adds it to the melody
let typedText = document.querySelector("#textField");

typedText.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        console.log("submit");
        changeSynthOsc(typedText.value); //changes synth type if user types waveform type into box
        changeText();
        event.preventDefault();
    }
});

function changeText() {
    letters = Array.from(typedText.value);
    console.log(letters);
    letterDivs.forEach((ldiv) => {
        ldiv.remove();
    });
    createLetters();
}

function createLetters() {
    letterDivs = [];
    yStart, (xStart = []);
    letters.forEach((letter) => {
        console.log(letter);
        addNotes(letter);
        changeSynthOsc(letter);
        let ldiv = document.createElement("div");
        ldiv.classList.add("letters");
        ldiv.innerHTML = letter;
        let t = Math.random() * 100;
        yStart.push(t);
        let l = Math.random() * 100;
        xStart.push(l);
        ldiv.style.top = `${t + Math.sin(accum)}%`;
        ldiv.style.left = `${l}%`;
        ldiv.classList.add("fadeOut");
        letterDivs.push(ldiv);
        document.getElementById("letters").appendChild(ldiv);
    });

    if (letterTimer) {
        clearInterval(letterTimer);
    }
    letterTimer = setInterval(randomizePositions, 250);

    // removeLetters();
}

//needs to remove letters and have the ones on screen update to reflect the changes.
function removeLetters() {
    if (letters.length > 0) {
        letters.pop();
        createLetters();
        // setTimeout(function() {
        //     removeLetters()
        // }, getRandomInt(5000, 15000));
        setTimeout(function() {
            if (defaultFlag != true) {
                defaultFlag = true;
                defaultFX();
                defaultFlag = false;
            }
        }, getRandomInt(10000, 120000));
    }
}

function randomizePositions() {
    accum += 0.4;
    letterDivs.forEach((ldiv, index) => {
        let l = Math.random() * 6 - 3.0;
        xStart[index] += l;
        ldiv.style.top = `${yStart[index] + Math.sin(accum) * 50}%`;
        ldiv.style.left = `${xStart[index]}%`;
        ldiv.classList.add(".fade-out");
    });
    //console.log(Math.sin(accum));
}

//user menu button
let btn = document.getElementById("myBtn");
btn.onclick = () => {
    Tone.start();
    modal.style.display = "block";
}; //make the button/interface look

//functions for setting the user mode via buttons. synth will not start until one is clicked
function setPlace() { //sets the various things for place mode
    userState = "Place";
    console.log(`You have set the User Mode to ${userState}`);

    let checkBox = document.getElementById("checkPlace");
    let text = document.getElementById("placeText");
    let view = document.getElementById("checkView");
    let edit = document.getElementById("checkEdit");
    let viewText = document.getElementById("viewText");
    let editText = document.getElementById("editText");
    let typeBox = document.getElementById("textField");
    // If the checkbox is checked, display the output text
    if (checkBox.checked == true) {
        text.style.display = "block";
        view.checked = false;
        edit.checked = false;
        viewText.style.display = "none";
        editText.style.display = "none";
        setTimeout(function() {
            if (defaultFlag != true) {
                defaultFlag = true;
                defaultFX();
                defaultFlag = false;
            }
        }, getRandomInt(10000, 120000));
    } else {
        text.style.display = "none";
        typeBox.style.display = "none";
    } //displaces current mode in console
    changeAppearance();
    seq();
}

function setView() { //sets the various things needed for view mode
    userState = "View";
    console.log(`You have set the User Mode to ${userState}`); //displays current mode in console
    let checkBox = document.getElementById("checkView");
    let text = document.getElementById("viewText");
    let place = document.getElementById("checkPlace");
    let edit = document.getElementById("checkEdit");
    let placeText = document.getElementById("placeText");
    let editText = document.getElementById("editText");
    let typeBox = document.getElementById("textField");

    if (checkBox.checked == true) {
        text.style.display = "block";
        place.checked = false;
        edit.checked = false;
        placeText.style.display = "none";
        editText.style.display = "none";
        setTimeout(function() {
            if (defaultFlag != true) {
                defaultFlag = true;
                defaultFX();
                defaultFlag = false;
            }
        }, getRandomInt(10000, 120000));
    } else {
        text.style.display = "none";
    }
    changeAppearance();
    seq();
}

function setEdit() { //sets the various things needed for edit mode
    userState = "Edit";
    console.log(`You have set the User Mode to ${userState}`); //displays current mode in console

    let checkBox = document.getElementById("checkEdit");
    let text = document.getElementById("editText");
    let place = document.getElementById("checkPlace");
    let view = document.getElementById("checkView");
    let viewText = document.getElementById("viewText");
    let placeText = document.getElementById("placeText");
    let typeBox = document.getElementById("textField");
    if (checkBox.checked == true) {
        text.style.display = "block";
        place.checked = false;
        view.checked = false;
        placeText.style.display = "none";
        viewText.style.display = "none";
        redSlider.classList.remove("hidden");
        greenSlider.classList.remove("hidden");
        blueSlider.classList.remove("hidden");
        setTimeout(function() {
            if (defaultFlag != true) {
                defaultFlag = true;
                defaultFX();
                defaultFlag = false;
            }
        }, getRandomInt(10000, 120000));
    } else {
        text.style.display = "none";
    }
    changeAppearance();
    seq();
}

// Get the modal
let modal = document.getElementById("myModal");
// Get the button that opens the modal
// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];
// When the user clicks the button, open the modal
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
};
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};


function changeAppearance() {
    if (userState === "Place") {
        viewModeScreenText.style.display = "none";
        document.getElementById("placeTools").classList.remove("hidden");
        document.getElementById("textField").classList.remove("hidden");
        redSlider.classList.add("hidden");
        greenSlider.classList.add("hidden");
        blueSlider.classList.add("hidden");
        setTimeout(function() {
            if (defaultFlag != true) {
                defaultFlag = true;
                defaultFX();
                defaultFlag = false;
            }
        }, getRandomInt(10000, 120000));
    } else if (userState === "Edit") {
        viewModeScreenText.style.display = "none";
        document.getElementById("placeTools").classList.add("hidden");
        document.getElementById("textField").classList.add("hidden");
        redSlider.classList.remove("hidden");
        greenSlider.classList.remove("hidden");
        blueSlider.classList.remove("hidden");
        setTimeout(function() {
            if (defaultFlag != true) {
                defaultFlag = true;
                defaultFX();
                defaultFlag = false;
            }
        }, getRandomInt(10000, 120000));
    } else if (userState === "View") {
        viewModeScreenText.style.display = "block";
        document.getElementById("placeTools").classList.add("hidden");
        document.getElementById("textField").classList.add("hidden");
        menu.classList.add("hidden");
        redSlider.classList.add("hidden");
        greenSlider.classList.add("hidden");
        blueSlider.classList.add("hidden");
        setTimeout(function() {
            if (defaultFlag != true) {
                defaultFlag = true;
                defaultFX();
                defaultFlag = false;
            }
        }, getRandomInt(10000, 120000));
    } else {
        viewModeScreenText.style.display = "none";
        document.getElementById("placeTools").classList.add("hidden");
        document.getElementById("textField").classList.add("hidden");
        menu.classList.add("hidden");
        redSlider.classList.add("hidden");
        greenSlider.classList.add("hidden");
        blueSlider.classList.add("hidden");
        setTimeout(function() {
            if (defaultFlag != true) {
                defaultFlag = true;
                defaultFX();
                defaultFlag = false;
            }
        }, getRandomInt(10000, 120000));
    }
}



let currentShape;
//the following functions make the various additional shapes when the menu items are clicked on
function makeSquare() {
    console.log("you clicked on the square");
    let squ = document.createElement("div");
    squ.classList.add("square");
    let area = document.getElementById("placeArea");
    area.appendChild(squ);
    squ.addEventListener("click", function(e) {
        if (userState === "Edit") {
            let shape = squ;
            let shapeColor = [];
            let r = document.getElementById("rSlide").value;
            shapeColor.push(r);
            let g = document.getElementById("gSlide").value;
            shapeColor.push(g);
            let b = document.getElementById("bSlide").value;
            shapeColor.push(b);

            shape.style.backgroundColor = `rgb(${shapeColor[0]}, ${shapeColor[1]}, ${shapeColor[2]})`;

            changeVerbTime(r); //adjusts synth params based on slider values
            changeDistortion(g);
            changechorusSpeed(b);

            for (let i = 0; i > 3; i++) {
                shapeColor.pop();
            }
        }
    });

    currentShape = squ;
    if (userState === "Place") {
        let newSquare = document.getElementById("mySquare");
        //let color = shapeColor();
        //squ.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
        squ.style.position = "absolute";
        area.onmousemove = (e) => { //shape follows the mouse
            if (currentShape) {
                currentShape.style.left = e.pageX + "px";
                currentShape.style.top = e.pageY + "px"; //.target.style?
            }
        }


        area.addEventListener("mouseup", function(e) {
            if (userState === "Place") { //places the shape when the mouse is released
                if (currentShape) {
                    let x = e.pageX;
                    let y = e.pageY;
                    currentShape.style.top = y;
                    currentShape.style.left = x;
                    currentShape = null;
                    changeDelayTime(x); //adjust the synth params
                    changechorusDepth(y);
                }
            }
        });
    }

    setTimeout(function() {
        if (defaultFlag != true) {
            defaultFlag = true;
            defaultFX();
            defaultFlag = false;
        }
    }, getRandomInt(10000, 120000));
}

function makeCircle() {
    console.log("you clicked on the circle");
    let squ = document.createElement("div");
    squ.classList.add("circle");
    let area = document.getElementById("placeArea");
    area.appendChild(squ);
    squ.addEventListener("click", function(e) {
        if (userState === "Edit") {
            let shape = squ;
            let shapeColor = [];
            let r = document.getElementById("rSlide").value;
            shapeColor.push(r);
            let g = document.getElementById("gSlide").value;
            shapeColor.push(g);
            let b = document.getElementById("bSlide").value;
            shapeColor.push(b);

            shape.style.backgroundColor = `rgb(${shapeColor[0]}, ${shapeColor[1]}, ${shapeColor[2]})`;

            changeVerbTime(r); //adjusts synth params based on slider values
            changeDistortion(g);
            changechorusSpeed(b);

            for (let i = 0; i > 3; i++) {
                shapeColor.pop();
            }
        }
    });
    currentShape = squ;
    if (userState === "Place") {
        let newSquare = document.getElementById("myCircle");
        //let color = shapeColor();
        // squ.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
        squ.style.position = "absolute";
        area.onmousemove = (e) => { //shape follows the mouse
            if (currentShape) {
                currentShape.style.left = e.pageX + "px";
                currentShape.style.top = e.pageY + "px"; //.target.style?
            }
        }


        area.addEventListener("mouseup", function(e) {
            if (userState === "Place") { //places the shape when the mouse is released
                if (currentShape) {
                    let x = e.pageX;
                    let y = e.pageY;
                    currentShape.style.top = y;
                    currentShape.style.left = x;
                    currentShape = null;
                    changeDelayTime(x); //adjust the synth params
                    changechorusDepth(y);
                }
            }
        });
    }
    setTimeout(function() {
        if (defaultFlag != true) {
            defaultFlag = true;
            defaultFX();
            defaultFlag = false;
        }
    }, getRandomInt(10000, 120000));
}

function makeParallel() {
    console.log("you clicked on the parallelogram");
    let squ = document.createElement("div");
    squ.classList.add("parallelogram");
    let area = document.getElementById("placeArea");
    area.appendChild(squ);
    squ.addEventListener("click", function(e) {
        if (userState === "Edit") {
            let shape = squ;
            let shapeColor = [];
            let r = document.getElementById("rSlide").value;
            shapeColor.push(r);
            let g = document.getElementById("gSlide").value;
            shapeColor.push(g);
            let b = document.getElementById("bSlide").value;
            shapeColor.push(b);

            shape.style.backgroundColor = `rgb(${shapeColor[0]}, ${shapeColor[1]}, ${shapeColor[2]})`;

            changeVerbTime(r); //adjusts synth params based on slider values
            changeDistortion(g);
            changechorusSpeed(b);

            for (let i = 0; i > 3; i++) {
                shapeColor.pop();
            }
        }
    });
    currentShape = squ;
    if (userState === "Place") {
        let newSquare = document.getElementById("myParallel");
        //let color = shapeColor();
        //squ.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
        squ.style.position = "absolute";
        area.onmousemove = (e) => { //shape follows the mouse
            if (currentShape) {
                currentShape.style.left = e.pageX + "px";
                currentShape.style.top = e.pageY + "px"; //.target.style?
            }
        }


        area.addEventListener("mouseup", function(e) {
            if (userState === "Place") { //places the shape when the mouse is released
                if (currentShape) {
                    let x = e.pageX;
                    let y = e.pageY;
                    currentShape.style.top = y;
                    currentShape.style.left = x;
                    currentShape = null;
                    changeDelayTime(x); //adjust the synth params
                    changechorusDepth(y);
                }
            }
        });
    }
    setTimeout(function() {
        if (defaultFlag != true) {
            defaultFlag = true;
            defaultFX();
            defaultFlag = false;
        }
    }, getRandomInt(10000, 120000));
}

function makeTri() {
    console.log("you clicked on the triangle");
    let squ = document.createElement("div");
    squ.classList.add("triangle-up");
    let area = document.getElementById("placeArea");
    area.appendChild(squ);

    currentShape = squ;
    if (userState === "Place") {
        let newSquare = document.getElementById("myTri");
        // let color = shapeColor();
        // squ.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
        squ.style.position = "absolute";
        area.onmousemove = (e) => { //shape follows the mouse
            if (currentShape) {
                currentShape.style.left = e.pageX + "px";
                currentShape.style.top = e.pageY + "px"; //.target.style?
            }
        }


        area.addEventListener("mouseup", function(e) {
            if (userState === "Place") { //places the shape when the mouse is released
                if (currentShape) {
                    let x = e.pageX;
                    let y = e.pageY;
                    currentShape.style.top = y;
                    currentShape.style.left = x;
                    currentShape = null;
                    changeDelayTime(x); //adjust the synth params
                    changechorusDepth(y);
                }
            }
        });
    }
    setTimeout(function() {
        if (defaultFlag != true) {
            defaultFlag = true;
            defaultFX();
            defaultFlag = false;
        }
    }, getRandomInt(10000, 120000));
}

function makeLine() {
    console.log("you clicked on the line");
    let squ = document.createElement("div");
    squ.classList.add("line");
    let area = document.getElementById("placeArea");
    area.appendChild(squ);

    currentShape = squ;
    if (userState === "Place") {
        let newSquare = document.getElementById("myLine");
        // let color = shapeColor();
        // squ.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
        squ.style.position = "absolute";
        area.onmousemove = (e) => { //shape follows the mouse
            if (currentShape) {
                currentShape.style.left = e.pageX + "px";
                currentShape.style.top = e.pageY + "px"; //.target.style?
            }
        }


        area.addEventListener("mouseup", function(e) {
            if (userState === "Place") { //places the shape when the mouse is released
                if (currentShape) {
                    let x = e.pageX;
                    let y = e.pageY;
                    currentShape.style.top = y;
                    currentShape.style.left = x;
                    currentShape = null;
                    changeDelayTime(x); //adjust the synth params
                    changechorusDepth(y);
                }
            }
        });
    }
    setTimeout(function() {
        if (defaultFlag != true) {
            defaultFlag = true;
            defaultFX();
            defaultFlag = false;
        }
    }, getRandomInt(10000, 120000));
}