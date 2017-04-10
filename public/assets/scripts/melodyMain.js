

function getStepPattern(mode) {
  var stepPattern = [0];
  // var pentatonicOptionPattern; // if pentatonic this will not be, if not pentatonic this will be.
  // I've removed this functionality for now.

  var untamperedStep = [2, 2, 1, 2, 2, 2, 1] // major

  if (typeof mode !== 'number')  {
    if (mode === 'maj') {
      mode = 0;
    } else if (mode === 'min') {
      mode = 5;
    } else {
      console.log("mode could not be recognized. Defaulting to major (0).");
      mode = 0;
    }
  } else if (mode > 6 || mode < 0) {
    console.log("Mode must be between 0 and 6. Defaulting to minor (5).");
    mode = 5;
  }

  untamperedStep.forEach(function(step, index) {

    // console.log(((mode + index)%untamperedStep.length), "step\t", mode, "mode\t", index, "index\t")
    stepPattern.push(untamperedStep[(index + mode)%untamperedStep.length])
  })
  console.log("stepPattern:")
  console.log(stepPattern)
  console.log("")
  return stepPattern;
}



function keyGen(key='c', mode='maj') {

  var chromeCopy = chromatic.map(function(note){
    return note
  })

  var noteIndex = 0;
  var noteIndexTonic;
  noteString.forEach(function(note, index){
    if (note === key) {
      noteIndexTonic = index;
      noteIndex = index;
    }
  })

  var stepPattern = getStepPattern(mode);


  var fullScale = []
  fullScale.push(chromeCopy[noteIndex]);

  for (var i = 0; i < stepPattern.length - 2; i++) {
    noteIndex += stepPattern[i];
    noteIndexCurrent = noteIndex + stepPattern[i+1];
    var previousNote = fullScale[fullScale.length - 1]
    var currentNote = chromeCopy[noteIndexCurrent%12]
    if (previousNote[0] > currentNote[0]) {
      fullScale.push(currentNote.slice(1));
    } else {
      fullScale.push(currentNote);
    }
  }
  fullScale.push(chromeCopy[noteIndexTonic].slice(1));
  console.log("");
  console.log(fullScale)
  console.log("");
  return fullScale;
}

function chordNoteGen135(keyNotes) {

  var keyModulo = keyNotes.length - 1

  return keyNotes.map(function(first, index) {
    var third = keyNotes[(index+2)%keyModulo];
    var fifth = keyNotes[(index+4)%keyModulo]
    return [first, third, fifth]
  })
}

// [float, int] -> time(seconds)
function beat(beatFraction, tempo=120) {
  return 240/tempo * beatFraction
};

var singleChord135 = function(keyNotes, chord=0, len=1, tempo=120, bar=0, octave=4) {
  var chords = chordNoteGen135(keyNotes);

  var startTime = beat(1, tempo) * bar;
  var endTime = (beat(1, tempo) * len) + (beat(1, tempo) * bar);

  var chordTonic = chords[chord][0][octave];
  var chordThird = chords[chord][1][octave];
  var chordFifth = chords[chord][2][octave];
  var chordNotes = [chordTonic, chordThird, chordFifth];


  return [[chordNotes, startTime, endTime]]
}


function randomQuarterChords(keyNotes, bar, tempo, octave=4) {
  // var octave = 3;

  var barValue = beat(1, tempo);
  // var halfNote = beat(.5, tempo);
  var quarterNote = beat(.25, tempo);
  // var eighthNote = beat(.125, tempo);
  // var teenthNote = beat(.0625, tempo);

  var chordStructure = [];
  var chordNotesList = chordNoteGen135(keyNotes);
  var chordComponents = [];

  var temporalStartBuffer = 0 + (barValue * bar);
  var temporalStopBuffer = quarterNote + (barValue * bar);

  var tonicTonic = chordNotesList[0][0][octave]
  var tonicThird = chordNotesList[0][1][octave]
  var tonicFifth = chordNotesList[0][2][octave]

  var tonicChord = [tonicTonic, tonicThird, tonicFifth]

  chordStructure.push([tonicChord, temporalStartBuffer, temporalStopBuffer]);
  chordComponents.push(chordNotesList[0])

  for (var i = 0; i < 3; i++) {
    var chordValue = Math.floor(Math.random()*keyNotes.length);
    temporalStartBuffer += quarterNote;
    temporalStopBuffer += quarterNote;

    var chordTonic = chordNotesList[chordValue][0][octave]
    var chordThird = chordNotesList[chordValue][1][octave]
    var chordFifth = chordNotesList[chordValue][2][octave]
    if (chordThird < chordTonic && chordNotesList[chordValue][1][octave + 1]) {
      chordThird = chordNotesList[chordValue][1][octave + 1]
    }
    if (chordFifth < chordThird &&  chordNotesList[chordValue][2][octave + 1]) {
      chordFifth = chordNotesList[chordValue][2][octave + 1]
    }
    var chordNoteIterations = [chordTonic, chordThird, chordFifth]

    chordStructure.push([chordNoteIterations, temporalStartBuffer, temporalStopBuffer])
    chordComponents.push(chordNotesList[chordValue])
  }

  return [chordStructure, chordComponents]
}


function melodyGenerator(noteSelections, bar, tempo, octave=5) {

  var barValue = beat(1, tempo);
  var halfNote = beat(.5, tempo);
  var quarterNote = beat(.25, tempo);
  var eighthNote = beat(.125, tempo);
  var teenthNote = beat(.0625, tempo);

  var melodyData = [];
  var barLocation = 0;
  var noteLengthOptions = [4, 8, 16];

  var beatLength = .25

  for (var i = 0; i < 4; i++) {
    beatLocation = 0;
    while (beatLocation < .25) {
      var noteValue = Math.floor(Math.random()*3);
      var note = noteSelections[i][noteValue][octave];

      var startTime = (barValue * barLocation) + (barValue * bar);
      var endBeat = 2;
      while (endBeat > (beatLength - beatLocation)) {
        endBeat = 1/(noteLengthOptions[Math.floor(Math.random()*3)]);
      }
      var endTime = startTime + beat(endBeat, tempo);
      melodyData.push([note, startTime, endTime]);
      beatLocation += endBeat;
      barLocation += endBeat;
    }
  }
  return melodyData;
}



function chordsMelodyAndBass(keyNotes, bar=0, tempo=120) {

  var chordData = randomQuarterChords(keyNotes, bar, tempo);
  var chordPlayReady = chordData[0];
  var chordComponents = chordData[1];

  var melodyPlayReady =  melodyGenerator(chordComponents, bar, tempo);

  var octave = 3;
  var bassPlayReady = melodyGenerator(chordComponents, bar, tempo, octave);

  var allThree = [chordPlayReady, melodyPlayReady, bassPlayReady];
  console.log(allThree);
  return allThree;
}






var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var masterOut = context.createGain()
var masterOut2 = context.createGain()
var masterMerge = context.createChannelMerger(1);
var synthDelay = context.createDelay(10)
synthDelay.delayTime.value = beat(1/8, 120)
masterMerge.connect(context.destination)
masterOut.connect(masterMerge)
masterOut2.connect(masterMerge)
// var gain = context.createGain();

function Kick(context) {
	this.context = context;
};

Kick.prototype.setup = function() {
	this.osc = this.context.createOscillator();
	this.gain = this.context.createGain();
	this.osc.connect(this.gain);
	this.gain.connect(this.context.destination)
};

Kick.prototype.trigger = function(time) {
	this.setup();

	this.osc.frequency.setValueAtTime(150, time);
	this.gain.gain.setValueAtTime(1, time);

	this.osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
	this.gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

	this.osc.start(time);

	this.osc.stop(time + 0.5);
};

// playNote(440, 0, beat(1/8, 120), true, false)

function playNote(frequency, start=0, stop=1, percussive=false, kick=false, bounce=false) {
  var gain = context.createGain();
  var gain2 = context.createGain();
  gain2.gain.value = .5;
  oscillator = context.createOscillator();
  oscillator.frequency.value = frequency;

  delayOsc = context.createOscillator()
  delayOsc.frequency.value = frequency;




  var currentTime = context.currentTime;






  delayOsc.connect(gain2)
  gain2.connect(synthDelay)

  synthDelay.connect(masterOut2)







  var distortion = context.createWaveShaper();

  // var gainNode = context.createGain();
  var biquadFilter = context.createBiquadFilter();
  var convolver = context.createConvolver();

  // oscillator.connect(context.destination);


  oscillator.connect(gain);


  //
  // var real = new Float32Array(4096);
  // var imag = new Float32Array(4096);
  // // Lets assume we’re starting with a simple sine wave:
  // var a1 = 0.0;
  // var b1 = 1.0;
  // // Apply a simple rotation to the initial coefficients
  // var shift = 2 * Math.PI * 0.5; // Shift the waveform 50%
  // real[1] = a1 * Math.cos(shift) - b1 * Math.sin(shift);
  // imag[1] = a1 * Math.sin(shift) + b1 * Math.cos(shift);
  // var wt = context.createPeriodicWave(real, imag);
  // // …
  // oscillator.setPeriodicWave(wt);


  // var real = new Float32Array([0,0,0,0,1,0,0,0]);
  // var imag = new Float32Array([0,1,0,0,0,1,0,0]);
  // var wave = context.createPeriodicWave(real, imag);
  // oscillator.setPeriodicWave(wave);
  // gain.connect(context.destination);


  // var now = context.currentTime;


  // var analyser = context.createAnalyser();


  // connect the nodes together

  // source = audioCtx.createMediaStreamSource(stream);
  // source.connect(analyser);
  // analyser.connect(distortion);

  distortion.connect(gain);

  // biquadFilter.connect(gain);
  // convolver.connect(gain);
  gain.connect(masterOut);

  // gainNode.connect(audioCtx.destination);

  // Manipulate the Biquad filter

  // biquadFilter.type = "lowpass";
  // biquadFilter.frequency.value = 300;
  // biquadFilter.gain.value = 25;



  if (kick) {
    var kickDrum = new Kick(context);
    kickDrum.trigger(currentTime + start);
  }


  gain.gain.setValueAtTime(1, (currentTime + start));

  if (percussive) {
    gain2.gain.exponentialRampToValueAtTime(0.001, (currentTime + stop))
    gain.gain.exponentialRampToValueAtTime(0.001, (currentTime + stop));
  }

  if (bounce) {
    var midpoint = (stop-start)/2
    // oscillator.frequency.exponentialRampToValueAtTime(frequency/2, midpoint);
    oscillator.frequency.exponentialRampToValueAtTime(frequency/2, stop);
  }

  delayOsc.start(currentTime + start);
  delayOsc.stop(currentTime + stop);
  delayOsc.disconnect;

  // var real = new Float32Array([0,0,0,0,1,0,0,0]);      // uncomment for tone variance
  // var imag = new Float32Array([0,1,0,0,0,1,0,0]);
  // var wave = context.createPeriodicWave(real, imag);
  // oscillator.setPeriodicWave(wave);
  oscillator.start(currentTime + start);
  oscillator.stop(currentTime + stop);
  oscillator.disconnect;
}

function melodyPlayer(melody, bar=0, percussive=false, kick=false, bounce=false, tempo=120) {
  var temporalBar = beat(1, tempo) * bar
  melody.forEach(function(noteData){
    var note = noteData[0]
    var startTime = noteData[1] + temporalBar
    var stopTime = noteData[2] + temporalBar
    playNote(note, startTime, stopTime, percussive, kick, bounce)
  })
}

function chordPlayer(chordStructure, bar=0, percussive=false, kick=false, bounce=false, tempo=120) {
  var temporalBar = beat(1, tempo) * bar
  chordStructure.forEach(function(chord) {
    var startTime = chord[1] + temporalBar
    var stopTime = chord[2] + temporalBar
    chord[0].forEach(function(note) {
      playNote(note, startTime, stopTime, percussive, kick, bounce)
    })
  })
}



function createAndPlay(keyInput=['c',0], bar=0, tempo=120, keyInput2="") {
  var key = keyGen(keyInput[0], keyInput[1]);
  var key2;


  if (keyInput2) {
    key2 = keyGen(keyInput2[0], keyInput2[1])
  } else {
    var noteIndex = 0
    noteString.forEach(function(note, index){
      if (note === keyInput[0]) {
        noteIndex = index
      }
    })
    var bridgeKey;
    var bridgeMode;
    if (keyInput[1] === 0 || keyInput[1] === 'maj' || !keyInput[1]) {
      bridgeKey = noteString[(noteIndex+9)%12]
      bridgeMode = 5;
    } else if (keyInput[1] === 5 || keyInput[1] === 'min') {
      bridgeKey = noteString[(noteIndex+3)%12]
      bridgeMode = 0;
    } else {
      bridgeKey = noteString[(noteIndex+1)%12]
      bridgeMode = (keyInput[1] + 3)%12 || 5;
    }
    console.log(bridgeKey, bridgeMode)
    key2 = keyGen(bridgeKey, bridgeMode)
  }
  var main1 = chordsMelodyAndBass(key)
  var main2 = chordsMelodyAndBass(key)
  var bridge1 = chordsMelodyAndBass(key2)
  var bridge2 = chordsMelodyAndBass(key2)

  var chordsMain1 = main1[0]
  var melodyMain1 = main1[1]
  var bassMain1 = main1[2]

  var chordsMain2 = main2[0]
  var melodyMain2 = main2[1]
  var bassMain2 = main2[2]


  var chordsBridge1 = bridge1[0]
  var melodyBridge1 = bridge1[1]
  var bassBridge1 = bridge1[2]

  var chordsBridge2 = bridge2[0]
  var melodyBridge2 = bridge2[1]
  var bassBridge2 = bridge2[2]

  var runningBar = 0;
  var sectionEnd = 6
  while (runningBar < sectionEnd) {
    if (runningBar % 2 === 0) {
      // chordPlayer(chordsMain1, runningBar, false, true);
      // melodyPlayer(melodyMain1, runningBar, false, false, true);
      melodyPlayer(bassMain1, runningBar);
    } else {
      // chordPlayer(chordsMain2, runningBar, false, true);
      // melodyPlayer(melodyMain2, runningBar, false, false, true);
      melodyPlayer(bassMain2, runningBar);
    }
    runningBar += 1;
  }
  sectionEnd += 2;

  while (runningBar < sectionEnd) {
    if (runningBar % 2 === 0) {
      // chordPlayer(chordsMain1, runningBar, false, true);
      melodyPlayer(melodyMain1, runningBar, false, true);
      melodyPlayer(bassMain1, runningBar);
    } else {
      // chordPlayer(chordsMain2, runningBar, false, true);
      melodyPlayer(melodyMain2, runningBar, false, true);
      melodyPlayer(bassMain2, runningBar);
    }
    runningBar += 1;
  }
  sectionEnd += 4;

  while (runningBar < sectionEnd) {
    if (runningBar % 2 === 0) {
      chordPlayer(chordsMain1, runningBar, false, true);
      melodyPlayer(melodyMain1, runningBar, true);
      // melodyPlayer(melodyMain1, runningBar, false, false, true);
      melodyPlayer(bassMain1, runningBar);
    } else {
      chordPlayer(chordsMain2, runningBar, false, true);
      melodyPlayer(melodyMain2, runningBar, true);
      // melodyPlayer(melodyMain2, runningBar, false, false, true);
      melodyPlayer(bassMain2, runningBar);
    }
    runningBar += 1;
  }
  sectionEnd += 4;

  while (runningBar < sectionEnd) {
    if (runningBar % 2 === 0) {
      chordPlayer(chordsMain1, runningBar, false, true);
      melodyPlayer(melodyMain1, runningBar, true);
      melodyPlayer(melodyMain1, runningBar, false, false, true);
      melodyPlayer(bassMain1, runningBar);
    } else {
      chordPlayer(chordsMain2, runningBar, false, true);
      melodyPlayer(melodyMain2, runningBar, true);
      melodyPlayer(melodyMain2, runningBar, false, false, true);
      melodyPlayer(bassMain2, runningBar);
    }
    runningBar += 1;
  }
  sectionEnd += 4

  while (runningBar < sectionEnd) {
    if (runningBar % 2 === 0) {
      chordPlayer(chordsMain1, runningBar, false, true);
      // melodyPlayer(melodyMain1, runningBar);
      melodyPlayer(melodyMain1, runningBar, false, false, true);
      melodyPlayer(bassMain1, runningBar);
    } else {
      chordPlayer(chordsMain2, runningBar, false, true);
      // melodyPlayer(melodyMain2, runningBar);
      melodyPlayer(melodyMain2, runningBar, false, false, true);
      melodyPlayer(bassMain2, runningBar);
    }
    runningBar += 1;
  }
  sectionEnd += 4;

  while (runningBar < sectionEnd) {
    if (runningBar % 2 === 0) {
      chordPlayer(chordsMain1, runningBar, false, true);
      melodyPlayer(melodyMain1, runningBar, false, false, true);
      melodyPlayer(melodyMain1, runningBar);
      melodyPlayer(bassMain1, runningBar);
    } else {
      chordPlayer(chordsMain2, runningBar, false, true);
      melodyPlayer(melodyMain2, runningBar);
      melodyPlayer(melodyMain2, runningBar, false, false, true);
      melodyPlayer(bassMain2, runningBar);
    }
    runningBar += 1;
  }
  sectionEnd += 4


  while (runningBar < sectionEnd) {
    if (runningBar % 2 === 0) {
      chordPlayer(chordsBridge1, runningBar, false, true);
      melodyPlayer(melodyBridge1, runningBar);
      melodyPlayer(bassBridge1, runningBar);
      melodyPlayer(bassBridge1, runningBar, false, false, true);
    } else {
      chordPlayer(chordsBridge2, runningBar, false, true);
      melodyPlayer(melodyBridge2, runningBar);
      melodyPlayer(bassBridge2, runningBar);
      melodyPlayer(bassBridge2, runningBar, false, false, true);
    }
    runningBar += 1;
  }
  sectionEnd += 4

  while (runningBar < sectionEnd) {
    if (runningBar % 2 === 0) {
      chordPlayer(chordsMain1, runningBar, false, true);
      melodyPlayer(melodyMain1, runningBar, true);
      // melodyPlayer(bassMain1, runningBar);
    } else {
      chordPlayer(chordsMain2, runningBar, false, true);
      melodyPlayer(melodyMain2, runningBar, true);
      // melodyPlayer(bassMain2, runningBar);
    }
    runningBar += 1;
  }

  chordPlayer(singleChord135(key, 0, 1.5), runningBar, false, true, true)

}

// createAndPlay(['d', 5])
