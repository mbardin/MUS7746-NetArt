//import * as nexusui from "https://cdn.skypack.dev/nexusui@2.1.6"; //not sure if I'll use these, but they look better than the default buttons etc
//Project by Matthew A. Bardin[2021]


//Global Variables
let synth, menu, input, squCol, cirCol, triCol, lineCol, sendButton, letterTimer, userState, editButt, viewButt, placeButt, reverb, PPDel, vib, distort, sequence, scaledTime;
let melody = ["A4", "E4", "D4"]; //starting melody for the synth. will get added to it later.

//for the text letter randomizing
let xStart = [];
let yStart = [];
let letters = [];
let letterDivs = [];
let accum = 0;

let allSquares = [];
let allEllipses = [];
let allTriangles = [];
let allLines = [];

let bgColor = { //240, 190, 16 is starting/default. Add transitions between them?
  r: 240,
  g: 190,
  b: 16
}

let instructions = "Choose your mode below.\nPlace: Lets you add new shapes and text to the environment.\nEdit: Lets you alter shapes and text in the invironment.\nView: Lets you observe what other users are doing in the environment." //add more info?

//loads the synth in first thing
function preload() {
  synth = new Tone.Synth({
    oscillator: {
      type: `sine`
    },
    envelope: {
      attack: 1,
      decay: 0.1,
      sustain: 1,
      release: 3
    }
  });

  //effects to be applied to the synth goes here
  reverb = new Tone.Reverb();
  PPDel = new Tone.PingPongDelay();
  vib = new Tone.Vibrato();
  distort = new Tone.Distortion();
}

function setup() {
  //sets defaults and creates menu items
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  ellipseMode(CENTER);
  squCol = [111, 172, 200];
  cirCol = [231, 189, 209];
  triCol = [150, 111, 214];
  lineCol = [253, 253, 150];

  userState = "open";
  console.log(userState);
  
  menu = new Menu();
  sendButton = new Send();

  //places on screen buttons for setting the modes
  placeButt = createButton("Place Mode");
  placeButt.position(width / 2 - 275, height - 200);
  placeButt.mousePressed(setPlace);
  placeButt.hide();
  viewButt = createButton("View Mode");
  viewButt.position(width / 2 - 40, height - 200);
  viewButt.mousePressed(setView);
  viewButt.hide();
  editButt = createButton("Edit Mode");
  editButt.position(width / 2 + 200, height - 200);
  editButt.mousePressed(setEdit);
  editButt.hide();

  //creates text input
  input = createInput();
  input.position(5, height - 30);
  //input.changed(changeText);
  input.hide();

  //sets the audio chain
  synth.chain(vib, distort, PPDel, reverb, Tone.Destination);
  //sets the transport parameters
  Tone.Transport.bpm = 60;
  Tone.Transport.start();
  //plays the melody
  sequence = new Tone.Sequence(function(time, note) {
    synth.triggerAttackRelease(note, 3.5);
  }, melody, '1n');

  sequence.start();
}

function draw() {
  background(bgColor.r, bgColor.g, bgColor.b);
  
  //how program responds to the user state. have ability to change while using?
  if (userState === "view") { //user just watches what is happening
    placeButt.hide();
    editButt.hide();
    viewButt.hide();

  } else if (userState === "edit") { //user can cange parameters of shapes and letters on the screen
    placeButt.hide();
    editButt.hide();
    viewButt.hide();

  } else if (userState === "place") { //user can place new shapes/text on the screen
    placeButt.hide();
    editButt.hide();
    viewButt.hide();
    input.show();
    if (mouseX > width - 150) { //menu only appears when mouse is near it. add transition
      menu.appear();
    }
    sendButton.appear();
  } else if (userState === "open") { //title screen with instructions. replace with lightbox in final version
    placeButt.show(); //buttons only appear when menu is up
    editButt.show();
    viewButt.show();
    push();
    fill(149, 181, 148)
    rect(width / 2, height / 2, 600, 400);
    textAlign(CENTER);
    textSize(18)
     fill(255);
    text(instructions, width / 2, height / 2 - 50);
    pop();
  }
}

function randomColor() { //generates a random color
  let color = [floor(random(256)), floor(random(256)), floor(random(256))];
  console.log(`This random color is: ${color}`); //displayes most recent random color in console
  return color;
}

//functions for setting the user mode via buttons
function setPlace() {
  userState = "place";
  Tone.Start(); //lets the tone library begin. Needed when used outside of p5
  console.log(`You have set the User Mode to ${userState}`); //displayes current mode in console
}

function setView() {
  userState = "view";
  Tone.Start();
  console.log(`You have set the User Mode to ${userState}`); //displays current mode in console
}

function setEdit() {
  userState = "edit";
  Tone.Start();
  console.log(`You have set the User Mode to ${userState}`); //displays current mode in console
}

//functions for clicking and dragging new shapes. Look at math for selection.



function addNotes(note){ //adds notes to melody. called when new text is send. Will add note names to the melody line
  
  //make an array of the note names. 
  
  //let possibleNotes = [uisdbisbgisb] possibleNotes.includes(note). //returns true/false
  if(note === "a" || note === "A" || note === "b" || note === "B" || note === "c" || note === "C" || note === "d" || note === "D" || note === "e" || note ==="E" || note === "f" || note === "F" || note === "g" || note === "G" || note === "a" || note === "A" || note === "b" || note === "B"){
    let oct = floor(random(1,7));
    let addNote = `${note}${oct}`;
    melody.push(addNote);
    console.log(`You added the note ${addNote} to the melody.`);
    console.log(`The melody is now: [${melody}]`)
  }
}

//these funcitons are used to adjust the parameters of the effect chain. will be tied to object values.
function changeVerbTime(){
  
}

function changeDelayTime(){
  
}

function changeDistortion(){
  
}

function changeVibratoSpeed(){
  
}

//displays text then randomizes its position taken from https://codepen.io/matthew-a-bardin/pen/oNYvKQP
//LOOK AT THIS NEXT

function keyPressed() {
  if(userState === "place"){
    if (keyCode === 13) {
      console.log(`you sent this text: ${input.value()}`);
    }
  }
}


//classes appear below here
//the input menu
class Menu {
  constructor() {

  }
  appear() {
    
    for(let i = 0; i> 10; i++){
      push();
      fill(randomColor());
      let dropSquare = new Squares('rect', 1, width - 50, 100, false);
      fill(randomColor());
      let dropEllipse = new Ellipses('ellipse', 1, width - 50, 250, false);
      fill(randomColor());
      let dropTri = new Triangles('tri', 1, width - 50, 400, false);
      fill(randomColor());
      let dropLine = new Lines('line', 1, width - 60, 570, false);
      pop();
      
      allSquares.push(dropSquare);
      allEllipses.push(dropEllipse);
      allTriangles.push(dropTri);
      allLines.push(dropLine);
    }
    console.log("lower stacks are made");

    let menuSquare = new Squares('rect', 1, width - 50, 100, true);
    let menuCir = new Ellipses('ellipse', 1, width - 50, 250, true);
    let menuTri = new Triangles('tri', 1, width - 50, 400, true);
    let menuLine = new Lines('line', 1, width - 60, 570, true);
    
    push();
    stroke(0);
    strokeWeight(10);
    line(width - 100, 0, width - 100, height);
    pop();


    menuSquare.appear();
    menuCir.appear();
    menuTri.appear();
    menuLine.appear();

  }
}
//shapes to be placed

class Squares{
   constructor(type, size, x, y, first) {

    this.type = type;
    this.size = size;
    this.x = x;
    this.y = y;
    this.firstPlace = first;
    this.w = 60;
    this.h = 60;
  }
  
  appear(){
     push();
      fill(squCol);
      stroke(255);
      strokeWeight(5);
      scale(this.size);
      rect(this.x, this.y, this.w, this.h);
      pop();
  }
   onMousePressed() { //work out this part
    if (mouseIsPressed) {
      
    }
  }
}
class Ellipses{
   constructor(type, size, x, y, first) {

    this.type = type;
    this.size = size;
    this.x = x;
    this.y = y;
    this.firstPlace = first;
    this.w = 60;
    this.h = 60;
  }
  
  appear(){
    push();
      fill(cirCol);
      stroke(255);
      strokeWeight(5);
      scale(this.size);
      ellipse(this.x, this.y, this.w, this.h);
      pop();
  }
   onMousePressed() { //work out this part
    if (mouseIsPressed) {
      
    }
  }
}
class Triangles{
   constructor(type, size, x, y, first) {

    this.type = type;
    this.size = size;
    this.x = x;
    this.y = y;
    this.firstPlace = first;
    this.w = 60;
    this.h = 60;
  }
  
  appear(){
     push();
      fill(triCol);
      stroke(255);
      strokeWeight(5);
      scale(this.size);
      triangle(this.x, this.y - (this.h / 2), this.x - (this.w / 2), this.y + (this.h / 2), this.x + (this.w / 2), this.y + (this.h / 2));
      pop();
  }
  
   onMousePressed() { //work out this part
    if (mouseIsPressed) {
      
    }
  }
}
class Lines{
   constructor(type, size, x, y, first) {

    this.type = type;
    this.size = size;
    this.x = x;
    this.y = y;
    this.firstPlace = first;
    this.w = 60;
    this.h = 60;
  }
  
  appear(){
    push();
      stroke(lineCol);
      strokeWeight(5);
      scale(this.size);
      line(this.x - 10, this.y + 10, this.x + 40, this.y - 50);
      pop();
  }
  
  onMousePressed() { //work out this part
    if (mouseIsPressed) {
      
    }
  }
}
  

//the fake send button
class Send {
  constructor() {
    this.shade = [149, 181, 148];
  }
  appear() {
    push();
    line(0, height - 35, width - 100, height - 35);
    line(width - 100, height - 35, width - 100, height);
    rectMode(CORNER);
    fill(this.shade);
    rect(170, height - 30, 125, 20, 20);
    pop();
    push();
    textAlign(CENTER);
    fill(255);
    strokeWeight(0);
    text(`Press enter to send`, 225, height - 17);
    pop();
  }
}