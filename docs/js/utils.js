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
    let deltaX = x2 - x1; //change in X
    let deltaY = y2 - y1; //change in Y
    let result = Math.abs(Math.sqrt(Math.pow(deltaX, 2) / Math.pow(deltaY, 2))); //distance formula
    return result;
}


//clipper function
function clippy(value, min = 0, max = 100){
  let result = Math.max(min, Math.min(value, max));
  return result;
}
