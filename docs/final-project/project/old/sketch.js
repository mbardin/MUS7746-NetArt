//import * as nexusui from "https://cdn.skypack.dev/nexusui@2.1.6"; //not sure if I'll use these, but they look better than the default buttons etc
//Project by Matthew A. Bardin[2021]



let instructions = "Choose your mode below.\nPlace: Lets you add new shapes and text to the environment.\nEdit: Lets you alter shapes and text in the environment.\nView: Lets you observe what other users are doing in the environment." //add more info?



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




//functions for clicking and dragging new shapes. Look at math for selection.




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