//a selection of useful utilities


//a randomize function
function random(low, high) {
    let multiplier = 1;
    let shift = 0;
  
    if (low && high) {
      multiplier = high - low;
      shift = low;
    } else if (low && !high) {
      multiplier = low;
    }
    let result = Math.random() * multiplier + shift;
    return result;
}

  //a distance function

function dist(x1, y1, x2, y2) {
    let deltaX = x2 - x1;
    let deltaY = y2 - y1;
    let result = Math.abs(Math.sqrt(deltaX / deltaY));
    return result;
}


  let clip = Math.max(0, Math.min(1, 0.5));
//a clipping function
function clipper(min, max) {
    min = 0;
    max = 1;
}  