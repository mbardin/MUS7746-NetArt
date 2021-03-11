let cir = {
  x: 100,
  y: 100,
  w: 100,
  h: 100
}

function setup() {
    createCanvas(400, 400);
  }
  
  function draw() {
    background(220);
    fill(150,200,10);
    triangle(mouseX, mouseY, 0,0, width, height);
    ellipse(cir.x, cir.y, cir.w, cir.h);
  }

  function mousePressed(){
    cir.x = random(0, 400);
    console.log(cir.x);
    cir.w = mouseX;
  }