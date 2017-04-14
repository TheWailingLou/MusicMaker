const hiHatStandards = [
  [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0],
  [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
  [1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0],
  [1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0],
  [1,0,1,1,1,0,1,0,1,0,1,1,1,1,1,0],
  [1,0,1,0,1,0,1,0,1,0,1,1,1,0,0,0],
  [1,0,1,0,1,0,1,0,1,1,1,0,1,0,0,0],
  [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
  [1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0],
  [1,0,0,0,1,0,0,0,1,0,0,1,0,0,1,0],
]

function hiHatArrayGen(probDistort=1, speedy=false) {
  var binaryArray = [];

  for (var i=0; i<16; i++) {
    binaryArray.push(1)
  }

  binaryArray = binaryArray.map(function(num, i) {

    var random = Math.random()

    if (speedy) {
      random += 0.5
    }

    if (random < .85*probDistort) { // sixteenthNotes
      num = 0;
    } else {
      num = 1;
    }

    if (i%2 === 0) { // eighthNotes
      if (random < .43*probDistort) {
        num = 0;
      } else {
        num = 1;
      }
    }
    if (i%4 === 0) { // quarterNotes
      if (random < .3*probDistort) {
        num = 0;
      } else {
        num = 1;
      }
    }
    if (i%8 === 0) { // halfNotes
      if (random < .1*probDistort) {
        num = 0;
      } else {
        num = 1;
      }
    }
    if (i === 0) { // halfNotes
      if (random < .05*probDistort) {
        num = 0;
      } else {
        num = 1;
      }
    }
    return num
  })
  var random = Math.random();
  var random2 = Math.random();

  if (random > 0.6) {
    console.log("doubled up end")
    for (var i=4; i<8; i++) {
      binaryArray[i+8] = binaryArray[i];
    }
  }

  if (random > 0.8) {
    console.log("doubled up beginning")
    for (var i=0; i<4; i++) {
      binaryArray[i+8] = binaryArray[i];
    }
  }

  return binaryArray;
}


function randomFromArray(arr) {
  var numOfOpenings = Math.floor(Math.random()*(arr.length+1));
  if (numOfOpenings > 2) {
    numOfOpenings = 2 + Math.floor(Math.random()*2)
  }
  var openingLocations = []
  for (var i=0; i<numOfOpenings; i++) {
    var random = Math.floor(Math.random()*arr.length)
    openingLocations.push(arr[random])
  }
  console.log(openingLocations, numOfOpenings)
  if (openingLocations.length > 3) {
    openingLocations = openingLocations.slice(0, 3)
  }
  return openingLocations
}

function genOpeningsFromArray(hiHatArray) {
  var openingArr = hiHatArray.map(function(){
    return 0;
  })
  var possibilities = []
  for (var i=0; i<hiHatArray.length-1; i++) {
    // console.log("p1", hiHatArray[i] === 1, "p2", hiHatArray[i+1] === 0)
    if (hiHatArray[i] === 1 && hiHatArray[i+1] === 0) {
      possibilities.push(i);
    }
  }
  
  if (!possibilities[0] && possibilities[0] !== 0 || Math.random() > 0.6) {
    possibilities = [Math.floor(Math.random()*16)]
  }
  console.log(`possibilities: ${possibilities}`)
  var openings = randomFromArray(possibilities);
  console.log(`openings ${openings}`)
  return openingArr.map(function(num, i){
    var flag = false;
    openings.forEach(function(index) {
      if (index === i) {
        flag = true;
      }
    })
    if (flag) {
      return 1;
    } else {
      return 0
    }
  })
}
