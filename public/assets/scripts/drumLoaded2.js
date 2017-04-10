

Array.prototype.condense = function(array2) {
  return this.map(function(num, i){
    if (num === 1 || array2[i] === 1) {
      return 1;
    } else {
      return 0;
    }
  })
}
// Fix up prefixing
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var masterOut = context.createGain();
var compareSwitch = context.createGain();
compareSwitch.gain.value = 0;
compareSwitch.connect(context.destination)
masterOut.gain.value = 1;
masterOut.connect(context.destination)

var now;

function loadSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  let audioPromise = new Promise ((resolve, reject) => {
    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
        soundBuffer = buffer;
        resolve(soundBuffer);
      })
    }
  })
  request.send()
  return audioPromise;
}
Promise.all([
  loadSound('/assets/mp3/kick.mp3'),
  loadSound('/assets/mp3/snare.mp3'),
  loadSound('/assets/mp3/snareSoft.mp3'),
  loadSound('/assets/mp3/hi-hat-closed.mp3'),
  loadSound('/assets/mp3/hi-hat-open.mp3'),
  loadSound('/assets/mp3/crash.mp3'),
  loadSound('/assets/mp3/crash2.mp3'),
  loadSound('/assets/mp3/ride.mp3'),
  loadSound('/assets/mp3/ride2.mp3'),
  loadSound('/assets/mp3/tomFloor.mp3'),
  loadSound('/assets/mp3/tomFloor2.mp3'),
  loadSound('/assets/mp3/tomMid.mp3'),
  loadSound('/assets/mp3/tomMidHigh.mp3'),
  loadSound('/assets/mp3/tomHigh.mp3')

]).then(function(bufferArray){
  now = context.currentTime

  var kickBuff = [bufferArray[0]];
  var snareBuff = [bufferArray[1], bufferArray[2]];
  var hiHatBuff = [bufferArray[3], bufferArray[4]];
  var crashBuff = [bufferArray[5], bufferArray[6]];
  var rideBuff = [bufferArray[7], bufferArray[8]];
  var tomBuff = [bufferArray[9], bufferArray[10], bufferArray[11], bufferArray[12], bufferArray[13]];


  var kick = new Percussion(context, kickBuff[0])
  var snare = new Percussion(context, snareBuff[1])
  var hiHat = new HiHat(context, hiHatBuff[0], hiHatBuff[1])
  var crash1 = new Cymbal(context, crashBuff[1])
  var crash2 = new Cymbal(context, crashBuff[0])
  var tom1 = new Percussion(context, tomBuff[0])
  var tom2 = new Percussion(context, tomBuff[1])
  var tom3 = new Percussion(context, tomBuff[2])
  var tom4 = new Percussion(context, tomBuff[3])
  var tom5 = new Percussion(context, tomBuff[4])
  var toms = [tom1, tom2, tom3, tom4, tom5];
  // beat(kick, snare, hiHat, crash1, crash2, 64)

  // bassFromHiHat(binaryArray, optimizeLocation=true, alwaysOnBeat=true, alwaysOffBeat=false;)

  var hiHatStandards = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
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

  var kickStandards = [
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0],
    [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0],
    [1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
    [1,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0],
    [1,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0],
    [1,0,1,0,0,0,0,0,1,1,0,0,0,0,0,0],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,1,0],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,1,0]
  ]

  var snareStandards = [
    [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0],
    [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
    [0,0,1,0,0,0,1,0,0,0,0,0,1,0,1,0],
    [0,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0],
    [0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0],
    [0,0,0,1,0,0,1,0,0,0,0,1,1,0,0,0],
    [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    [0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0]
  ]
  var hiHatTest = [1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,1];
  // var hiHatOpenings = [0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0]


  var kickArr = [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0];
  var snareArr = [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]
  var hiHatArray = hiHatArrayGen()
  // var hiHatArray = hiHatStandards[Math.floor(Math.random()*hiHatStandards.length)]
  var hiHatOpenings = genOpeningsFromArray(hiHatArray)
  console.log(`hiHatOpenings: ${hiHatOpenings}`)
  var bassArray = kickStandards[Math.floor(Math.random()*kickStandards.length)]
  var snareArray = snareStandards[Math.floor(Math.random()*snareStandards.length)]

  var hiHatArray2 = hiHatStandards[Math.floor(Math.random()*hiHatStandards.length)]
  var bassArray2 = kickStandards[Math.floor(Math.random()*kickStandards.length)]
  var snareArray2 = snareStandards[Math.floor(Math.random()*snareStandards.length)]


  console.log(hiHatArray)
  console.log(bassArray)
  console.log(snareArray)
  console.log(hiHatArray2)
  console.log(bassArray2)
  console.log(snareArray2)

  var quarter = [0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0]

  var beatSwitch = true;
  for (var i=0; i<16; i++) {
    if (i%4 === 0 && i !== 0) {
      if (beatSwitch) {
        crash1.trigger(i*4*0.5)
      } else {
        crash2.trigger(i*4*0.5)
      }
      // crash2.trigger((i*4*0.5)-0.25)
      beatSwitch = !beatSwitch;
    }
    if (beatSwitch) {
      if ((i+1)%4 === 0) {
        hiHatRead(dramaticPausify(hiHatArray, 8), hiHatOpenings, hiHat, i)
        percussionRead(dramaticPausify(kickArr, 8), kick, i)
        percussionRead(dramaticPausify(snareArr, 8), snare, i)
        var tomFill = generateTomFill(8)
        console.log(tomFill)
        tomFillRead(tomFill, toms, i)
      } else {
        hiHatRead(hiHatArray, hiHatOpenings, hiHat, i)
        percussionRead(kickArr, kick, i)
        percussionRead(snareArr, snare, i)
      }

    } else {
      if ((i+1)%4 === 0) {
        hiHatRead(dramaticPausify(hiHatArray2, 8), hiHatOpenings, hiHat, i)
        percussionRead(dramaticPausify(bassArray, 8), kick, i)
        percussionRead(dramaticPausify(snareArray, 8), snare, i)
        var tomFill = generateTomFill(8)
        console.log(tomFill)
        tomFillRead(tomFill, toms, i)
      } else {
        hiHatRead(hiHatArray2, hiHatOpenings, hiHat, i)
        percussionRead(bassArray, kick, i)
        percussionRead(snareArray, snare, i)
      }

    }
  }

  function generateTomFill(numOfTeenths) {
    var tomArray = [];
    var cap;
    var downward = Math.random() < 0.7;
    console.log(`downward: ${downward}`)
    if (downward) {
      cap = 4;
    } else {
      cap = 0;
    }
    var tomLast = 0;
    var streak = 0;
    var hitStreak = 0;
    for (var i=0; i<16; i++) {
      if (i <= (16 - numOfTeenths) || i===15) {
        tomArray.push(0);
      } else {
        var silence = Math.random() < 0.3;
        var tomNum;
        if (silence) {
          tomNum = 0;
        } else {
          if (downward) {
            tomNum = Math.floor(Math.random()*(cap+1));
          } else {
            tomNum = Math.floor(Math.random()*(4-cap))+cap;
          }
          tomNum += 1;
        }

        console.log(`tomLast: ${tomLast}, tomNum: ${tomNum}, streak: ${streak}`)
        if (tomLast === tomNum) {
          streak += 1;
        } else {
          streak = 0;
        }
        console.log(`streak: ${streak}`)

        if (streak > 3) {
          console.log("this was a streak")
          tomNum += 2;
          tomNum %= 5;
        }

        if (tomNum !== 0) {
          hitStreak += 1;
          if (hitStreak >= 4) {
            tomNum = 0;
            hitStreak = 0;
          } else {
            cap = tomNum-1;
          }
        }

        tomLast = tomNum;

        // console.log(`tomNum: ${tomNum}, cap: ${cap}`)

        tomArray.push(tomNum);
      }
    }
    return tomArray
  }

  function tomFillRead(fillArray, tomsArray, bar=0, beatLength=0.5) {
    var teenth = beatLength/4
    var barDuration = beatLength * 4
    var temporalLocation = barDuration * bar

    fillArray.forEach(function(tomNum, i) {
      if (tomNum !== 0) {
        tomsArray[tomNum-1].trigger(i*teenth + temporalLocation)
      }
    })
  }

  function genOpeningsFromArray(hiHatArray) {
    var openingArr = hiHatArray.map(function(){
      return 0;
    })
    var possibilities = []
    for (var i=0; i<hiHatArray.length-1; i++) {
      if (hiHatArray[i] === 1 && hiHatArray[i+1] === 0) {
        possibilities.push(i);
      }
    }
    if (!possibilities[0]) {
      console.log("hitting here")
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
})

function dramaticPausify(beatArray, dramaticPauseBegin=4) {
  return beatArray.map(function(num, i) {
    if (i > 16-dramaticPauseBegin) {
      return 0
    } else {
      return num;
    }
  })
}

function percussionRead(beatArray, instrument, bar=0, beatLength=0.5) {
  var barSize = beatArray.length;
  var teenth = beatLength/4
  var barDuration = beatLength * 4
  var temporalLocation = barDuration * bar
  beatArray.forEach(function(num, i) {
    if (num === 1) {
      instrument.trigger(i*teenth + temporalLocation)
    }
  })
}

function hiHatRead(beatArray, hiHatOpenArray, hiHat, bar=0, beatLength=0.5) {
  var teenth = beatLength/4
  var barDuration = beatLength * 4
  var temporalLocation = barDuration * bar
  beatArray.forEach(function(num, i) {
    if (num === 1) {
      var hiHatOpen = hiHatOpenArray[i] === 1;
      hiHat.trigger(i*teenth + temporalLocation, hiHatOpen)
    }
  })
}

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

  console.log(binaryArray)
  return binaryArray;
}

function analyzeArray(binaryArray) {
  var halfCounts = 0;
  var quarterCounts = 0;
  var eighthCounts = 0;
  var teenthCounts = 0;
  var noteCount = 0;

  var longestSpace = -1;
  var currentLongestSpace = -1;
  var longestStreak = -1;
  var currentLongestStreak = -1;
  var longestSpaceEndsAt = 0;
  var longestStreakEndsAt = 0;

  binaryArray.forEach(function(num, i) {
    if (num === 1) {
      currentLongestStreak += 1;
      currentLongestSpace = 0;
      noteCount += 1
      if (i%8 === 0) {
        halfCounts += 1;
      } else if (i%4 === 0) {
        quarterCounts += 1;
      } else if (i%2 === 0) {
        eighthCounts += 1;
      } else {
        teenthCounts += 1;
      }
    } else {
      currentLongestStreak = 0;
      currentLongestSpace += 1;
    }
    if (currentLongestSpace > longestSpace) {
      longestSpace = currentLongestSpace;
      longestSpaceEndsAt = i;
    }
    if (currentLongestStreak > longestStreak) {
      longestStreak = currentLongestStreak;
      longestStreakEndsAt = i;
    }
  })

  var longestStreakBeginsAt = longestStreakEndsAt + 1 - longestStreak;
  var longestSpaceBeginsAt = longestSpaceEndsAt + 1 - longestSpace;

  var qHeavy = false;
  var eHeavy = false;
  var tHeavy = false;
  var nHeavy = false;

  var qPure = false;
  var ePure = false;
  var tPure = false;
  var nPure = false;

  if (quarterCounts+halfCounts === 4) {
    qHeavy = true
    qPure = true;
  }

  if (eighthCounts >= 3) {
    eHeavy = true;
    if (eighthCounts === 4 && qPure) {
      ePure = true;
    }
  }

  if (teenthCounts >= 3) {
    tHeavy = true;
    if (teenthCounts === 8 && ePure) {
      tPure = true;
    }
  }

  if (noteCount >= 8) {
    nHeavy = true;
  }


  var spatialized = false;
  var streaky = false;
  var nonStreaky = false;

  if (longestSpace >= 4) {
    spatialized = true;
  }

  if (longestStreak >= 4) {
    streaky = true;
  }

  if (!spatialized && !streaky) {
    nonStreaky = true;
  }


  var disjunct = false;
  var dull = false;
  var purityValidation = !qPure && !ePure && !tPure
  var notesInAll = halfCounts > 0 && quarterCounts > 0 &&
    eighthCounts > 0 && teenthCounts > 0;
  var streakQualifier = spatialized && noteCount >= 6 || streaky && noteCount <= 9;

  if (purityValidation && notesInAll && streakQualifier) {
    disjunct = true;
  }

  if (!purityValidation && !notesInAll && !streakQualifier) {
    dull = true;
  }

  var countTally = [halfCounts, quarterCounts, eighthCounts, teenthCounts, noteCount]
  var countHeavy = [qHeavy, eHeavy, tHeavy, nHeavy]
  var purity = [qPure, ePure, tPure]
  var streaks = [
    [longestStreak, longestStreakBeginsAt, longestStreakEndsAt],
    [longestSpace, longestSpaceBeginsAt, longestSpaceEndsAt]
  ]
  var spacing = [spatialized, streaky, nonStreaky]



  var analysis = {
    countTally,
    countHeavy,
    purity,
    streaks,
    spacing,
    disjunct
  }

  return analysis;
}

function bassFromHiHat(binaryArray, optimizeLocation=true, alwaysOnBeat=true, alwaysOffBeat=false) {
  // if optimizeLocation is true it will focus on quarterNotes and high density locations.
  // if alwaysOnBeat is true it will play only notes that have been hit by the hi-hat.
  // if alwaysOffBeat is true it will only play on beats that haven't been true.
  // Both can't be true.
  // if all 3 are false, it will use the hiHatArrayGen function to create the array.

  if (alwaysOnBeat && alwaysOffBeat) {
    console.error("alwaysOnBeat and alwaysOffBeat can't both be true.")
  }

  if (!optimizeLocation && !alwaysOnBeat && !alwaysOffBeat) {
    return hiHatArrayGen(1.3)
  }

  var newBeat;
  if ((alwaysOnBeat || alwaysOffBeat) && !optimizeLocation) {
    newBeat = unoptomizedLocation(binaryArray, alwaysOnBeat, alwaysOffBeat)
  } else {
    newBeat = optimizedLocation(binaryArray, alwaysOnBeat, alwaysOffBeat)
  }

  return newBeat;
}

function unoptomizedLocation(binaryArray, alwaysOnBeat, alwaysOffBeat) {
  return binaryArray.map(function(num) {
    var comparator = 0;
    if (alwaysOnBeat) {
      comparator = 1;
    }
    if (num === comparator) {
      if (Math.random() > .5) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  })
}

function optimizedLocation(binaryArray, alwaysOnBeat, alwaysOffBeat) {
  var analysis = analyzeArray(binaryArray);
  var beatCountAll = analysis.countTally[4]

  var longestStreakStart = analysis.streaks[0][1]
  var longestStreakEnd = analysis.streaks[0][2]
  var longestSpaceStart = analysis.streaks[1][1]
  var longestSpaceEnd = analysis.streaks[1][2]
  var currentStreakAllNotes = 0;
  var currentStreak = 0;
  var totalNotes = 0;
  var beginStreakPlayed = false;
  var beginSpacePlayed = false;

  var onBeat = binaryArray.map(function(num, i) {
    var random = Math.random()
    var option = 0;
    if (num === 1) {
      if (i === 0) {
        currentStreakAllNotes += 1;
        currentStreak += 1;
        return 1;
      }
      if (i%8 === 0) {
        if (random > 0.5) {
          option = 1;
        }
      }
      if (i%4 === 0) {
        if (random > 0.6) {
          option = 1;
        }
      }
      if (i%2 === 0) {
        if (random > 0.8) {
          option = 1;
        }
      } else {
        if (random > 0.95) {
          option = 1;
        }
      }

      if (longestStreakStart === i) {

        totalNotes += 1
        currentStreakAllNotes += 1;
        currentStreak += 1;
        return 1;
      }

      if (longestStreakEnd === i ) {
        if (random > 0.9) {
          option = 1;
          beginStreakPlayed = true;
        }
      }

      var condition1 = currentStreakAllNotes === 0;
      var condition2 = beatCountAll >= 8;
      var condition3 = totalNotes < (beatCountAll/3)

      var negateCondition1 = currentStreakAllNotes >= 1;
      var negateCondition2 = beatCountAll <= 6
      var negateCondition3 = totalNotes >= 3
      var negateCondition4 = !(longestStreakStart === i)

      if (option === 0) {
        if (condition1 && condition2 && condition3) {
          option = 1;
          totalNotes += 1
          currentStreakAllNotes += 1;
          currentStreak += 1;
        } else {
          currentStreakAllNotes = 0;
          currentStreak = 0;
        }
      } else {
        if ((negateCondition1 && negateCondition2) || (negateCondition3 && negateCondition4)) {
          option = 0;
          currentStreakAllNotes = 0;
          currentStreak = 0;
        } else {
          currentStreakAllNotes += 1;
          currentStreak += 1;
          totalNotes += 1;
        }
      }
      return option;
    } else {
      currentStreakAllNotes = 0;
      return 0;
    }
  })

  return onBeat
}

function Percussion(context, audioBuffer) {
	this.context = context;
  this.buffer = audioBuffer;
};

Percussion.prototype.setup = function(velocity=1) {
  var variantRange = Math.random()*900
  this.variant = this.context.createBiquadFilter();
  this.variant.type = "peaking";
  this.variant.frequency.value = 100 + variantRange;
  this.variant.gain.value = 2;

  this.source = this.context.createBufferSource();
  this.source.buffer = this.buffer;
	this.gain = this.context.createGain();
  this.gain.gain.value = velocity - Math.random()*0.4
	this.source.connect(this.variant)
  this.variant.connect(this.gain)
	this.gain.connect(masterOut)
};

Percussion.prototype.trigger = function(start=0) {
	this.setup();
	this.source.start(now + start);
	this.source.stop(now + start + 1.0);
};


function HiHat(context, audioBuffer, audioBufferOpen) {
	this.context = context;
  this.openBuffer = audioBufferOpen;
  this.buffer = audioBuffer;
  this.open = false;

};

HiHat.prototype.setup = function(open=false, velocity=1) {
  var variantRange = Math.random()*4000
  this.variant = this.context.createBiquadFilter();
  this.variant.type = "peaking";
  this.variant.frequency.value = 5000 + variantRange;
  this.variant.gain.value = 2;

  if (!open) {
    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;
  	this.gain = this.context.createGain();
    this.gain.gain.value = velocity - Math.random()*0.4

  	this.source.connect(this.variant)
    this.variant.connect(this.gain)
    this.gain.connect(masterOut)
  } else {
    this.open = true;
    this.source2 = this.context.createBufferSource();
    this.source2.buffer = this.openBuffer;
  	this.gain2 = this.context.createGain();
    this.gain2.gain.value = velocity - (Math.random()*0.4 * velocity)

  	this.source2.connect(this.variant)
    this.variant.connect(this.gain2)
    this.gain2.connect(masterOut)
  }
};

HiHat.prototype.trigger = function(start=0, open=false) {
  if (start !== 0) {
    // start += (10-(Math.random()*20))/1000 // adds variability;
  }
  if (open) {
    if (this.open) {
      this.source2.stop(now+start)
      this.open = false;
    }
    this.setup(true)
    this.source2.start(now + start);
    this.source2.stop(now + start + 4.0);
  } else {
    if (this.open) {
      this.source2.stop(now+start)
      this.open = false;
    }
    this.setup()
    this.source.start(now + start);
    this.source.stop(now + start + 1.0);
  }

};


function PercussionCompare(context, audioBuffer) {
	this.context = context;
  this.buffer = audioBuffer;
};

PercussionCompare.prototype.setup = function(velocity=1) {

  this.source = this.context.createBufferSource();
  this.source.buffer = this.buffer;
	this.gain = this.context.createGain();
  this.gain.gain.value = .8 + 2/((Math.random()*20)-10);
	this.source.connect(this.gain)
	this.gain.connect(compareSwitch)
};

PercussionCompare.prototype.trigger = function(start=0) {
	this.setup();
	this.source.start(now + start);
	this.source.stop(now + start + 1.0);
};

////////////////////////////////////////////////////////////////////////////////

function Cymbal(context, audioBuffer) {
	this.context = context;
  this.buffer = audioBuffer;
};

Cymbal.prototype.setup = function(velocity=1) {
  this.source = this.context.createBufferSource();
  this.source.buffer = this.buffer;
	this.gain = this.context.createGain();
  this.gain.gain.value = velocity;
	this.source.connect(this.gain)
	this.gain.connect(masterOut)
};

Cymbal.prototype.trigger = function(start=0, velocity=.7, earlyStop=null) {
	this.setup(velocity);
	this.source.start(now + start);
  if (earlyStop) {
    this.source.stop(now + start + earlyStop);
  } else {
    this.source.stop(now + start + 7.0)
  }
};

Cymbal.prototype.triggerTimed = function(bar=0, beatLength=0.5, velocity=.7, earlyStop=null) {

  var barDuration = beatLength * 4
  var temporalLocation = barDuration * bar

  this.setup(velocity);
	this.source.start(now + temporalLocation);

  if (earlyStop) {
    this.source.stop(now + temporalLocation + earlyStop);
  } else {
    this.source.stop(now + temporalLocation + + 7.0)
  }
};


var muted = false;
$(document).keydown(function(event){
  if (event.which === 32) {
    if (!muted) {
      // console.log("space pressed")
      // compareSwitch.gain.value = 0;
      masterOut.gain.value = 0;
      muted = true;
    } else {
      // compareSwitch.gain.value = 1;
      masterOut.gain.value = 1;
      muted = false;
    }
  }
})
