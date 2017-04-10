// function playNote(frequency, start=0, stop=1, percussive=false, kick=false, bounce=false) {
//   var gain = context.createGain();
//   var gain2 = context.createGain();
//   gain2.gain.value = .5;
//   oscillator = context.createOscillator();
//   oscillator.frequency.value = frequency;
//
//   delayOsc = context.createOscillator()
//   delayOsc.frequency.value = frequency;
//
//   var currentTime = context.currentTime;
//
//   delayOsc.connect(gain2)
//   gain2.connect(synthDelay)
//
//   synthDelay.connect(masterOut2)
//
//
//   var distortion = context.createWaveShaper();
//
//   // var gainNode = context.createGain();
//   var biquadFilter = context.createBiquadFilter();
//   var convolver = context.createConvolver();
//
//   // oscillator.connect(context.destination);
//
//
//   oscillator.connect(gain);
//
//
//   //
//   // var real = new Float32Array(4096);
//   // var imag = new Float32Array(4096);
//   // // Lets assume we’re starting with a simple sine wave:
//   // var a1 = 0.0;
//   // var b1 = 1.0;
//   // // Apply a simple rotation to the initial coefficients
//   // var shift = 2 * Math.PI * 0.5; // Shift the waveform 50%
//   // real[1] = a1 * Math.cos(shift) - b1 * Math.sin(shift);
//   // imag[1] = a1 * Math.sin(shift) + b1 * Math.cos(shift);
//   // var wt = context.createPeriodicWave(real, imag);
//   // // …
//   // oscillator.setPeriodicWave(wt);
//
//
//   // var real = new Float32Array([0,0,0,0,1,0,0,0]);
//   // var imag = new Float32Array([0,1,0,0,0,1,0,0]);
//   // var wave = context.createPeriodicWave(real, imag);
//   // oscillator.setPeriodicWave(wave);
//   // gain.connect(context.destination);
//
//
//   // var now = context.currentTime;
//
//
//   // var analyser = context.createAnalyser();
//
//
//   // connect the nodes together
//
//   // source = audioCtx.createMediaStreamSource(stream);
//   // source.connect(analyser);
//   // analyser.connect(distortion);
//
//   distortion.connect(gain);
//
//   // biquadFilter.connect(gain);
//   // convolver.connect(gain);
//   gain.connect(masterOut);
//
//   // gainNode.connect(audioCtx.destination);
//
//   // Manipulate the Biquad filter
//
//   // biquadFilter.type = "lowpass";
//   // biquadFilter.frequency.value = 300;
//   // biquadFilter.gain.value = 25;
//
//
//
//   if (kick) {
//     var kickDrum = new Kick(context);
//     kickDrum.trigger(currentTime + start);
//   }
//
//
//   gain.gain.setValueAtTime(1, (currentTime + start));
//
//   if (percussive) {
//     gain2.gain.exponentialRampToValueAtTime(0.001, (currentTime + stop))
//     gain.gain.exponentialRampToValueAtTime(0.001, (currentTime + stop));
//   }
//
//   if (bounce) {
//     var midpoint = (stop-start)/2
//     // oscillator.frequency.exponentialRampToValueAtTime(frequency/2, midpoint);
//     oscillator.frequency.exponentialRampToValueAtTime(frequency/2, stop);
//   }
//
//   delayOsc.start(currentTime + start);
//   delayOsc.stop(currentTime + stop);
//   delayOsc.disconnect;
//
//   // var real = new Float32Array([0,0,0,0,1,0,0,0]);      // uncomment for tone variance
//   // var imag = new Float32Array([0,1,0,0,0,1,0,0]);
//   // var wave = context.createPeriodicWave(real, imag);
//   // oscillator.setPeriodicWave(wave);
//   oscillator.start(currentTime + start);
//   oscillator.stop(currentTime + stop);
//   oscillator.disconnect;
// }

// const c = [16.35, 32.70, 65.41, 130.81, 261.63, 523.25, 1046.50, 2093.00, 4186.01];
// const db = [17.32, 34.65, 69.30, 138.59, 277.18, 554.37, 1108.73, 2217.46, 4434.92];
// const d = [18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.02, 4698.63];
// const eb = [19.45, 38.89, 77.78, 155.56, 311.13, 622.24, 1244.51, 2489.02, 4978.03];
// const e = [20.60, 41.20, 82.41, 164.81, 329.63, 659.25, 1318.51, 2637.02, 5274.04];
// const f = [21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91, 2793.83, 5587.65];
// const gb = [23.12, 46.25, 92.50, 185.00, 369.99, 739.99, 1479.98, 2959.96, 5919.91];
// const g = [24.50, 49.00, 98.00, 196.00, 392.00, 783.99, 1567.98, 3135.96, 6271.93];
// const ab = [25.96, 51.91, 103.83, 207.65, 415.30, 830.61, 1661.22, 3322.44, 6644.88];
// const a = [27.50, 55.00, 110.00, 220.00, 440.00, 880.00, 1760.00, 3520.00, 7040.00];
// const bb = [29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66, 3729.31, 7458.62];
// const b = [30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.07, 7902.13];
//
// const chromatic = [c, db, d, eb, e, f, gb, g, ab, a, bb, b];
//
// const noteString = ['c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'bb', 'b'];

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

function Kick(context, i) {
	this.num = i
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



var kick = new Kick(context, 1);


function Tom1(context) {
	this.context = context;
};

Tom1.prototype.setup = function() {
	this.osc1 = this.context.createOscillator();
  this.osc2 = this.context.createOscillator()
	this.gain1 = this.context.createGain();
  this.gain2 = this.context.createGain()
	this.osc1.connect(this.gain1);
  this.osc2.connect(this.gain2)
	this.gain1.connect(this.context.destination)
  this.gain2.connect(this.context.destination)
};

Tom1.prototype.trigger = function(time) {
	this.setup();
	this.osc1.frequency.setValueAtTime(130.81, time);
  this.osc2.frequency.setValueAtTime(65.41, time);
	this.gain1.gain.setValueAtTime(2, time);
  this.gain2.gain.setValueAtTime(2, time);
	this.osc1.frequency.exponentialRampToValueAtTime(65.41, time + 0.1);
  this.osc2.frequency.exponentialRampToValueAtTime(130.81, time + 0.1);
  this.osc2.frequency.exponentialRampToValueAtTime(65.41, time + 0.2);
  this.osc1.frequency.exponentialRampToValueAtTime(130.81, time + 0.2);
  this.osc1.frequency.exponentialRampToValueAtTime(65.41, time + 0.3);
  this.osc2.frequency.exponentialRampToValueAtTime(130.81, time + 0.3);
	this.gain1.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
  this.gain2.gain.exponentialRampToValueAtTime(0.5, time + 0.5);
	this.osc1.start(time);
  this.osc2.start(time);
	this.osc1.stop(time + 0.5);
	this.osc2.stop(time + 0.5);
};

function Snare(context) {
	this.context = context;
};

Snare.prototype.noiseBuffer = function() {
	var bufferSize = this.context.sampleRate;
	var buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
	var output = buffer.getChannelData(0);

	for (var i = 0; i < bufferSize; i++) {
    // if (i%2 === 0) {
    //   output[i] = (i%100)/100
    // } else {
      output[i] = (Math.random() * 2 - 1);
    // }


		// output[i] = Math.random() * 2 - 1;
	}
  console.log(output)

  console.log(bufferSize)

	return buffer;
};

Snare.prototype.setup = function() {
	this.noise = this.context.createBufferSource();
	this.noise.buffer = this.noiseBuffer();
	this.noiseFilter = this.context.createBiquadFilter();
  var noiseFilter = this.noiseFilter
	noiseFilter.type = 'highpass';
	noiseFilter.frequency.value = 1000;
	this.noise.connect(noiseFilter);
  this.noiseEnvelope = this.context.createGain();
  noiseFilter.connect(this.noiseEnvelope);

  this.noiseEnvelope.connect(this.context.destination);

  this.osc = this.context.createOscillator();
  this.osc.type = 'sawtooth';

  this.oscEnvelope = this.context.createGain();
  // this.osc.connect(this.oscEnvelope);
  this.oscEnvelope.connect(this.context.destination);
};



Snare.prototype.trigger = function(time) {
	this.setup();

	this.noiseEnvelope.gain.setValueAtTime(1, time);
	this.noiseEnvelope.gain.exponentialRampToValueAtTime(0.5, time + 1);

  for (var i=0; i<10; i++) {
    if (i%2 === 0) {
      this.noiseFilter.frequency.exponentialRampToValueAtTime(1000, time + i/10)
    } else {
      this.noiseFilter.frequency.exponentialRampToValueAtTime(500, time + i/10)
    }
  }
  this.noise.start(time)

	this.osc.frequency.setValueAtTime(200, time);
	this.oscEnvelope.gain.setValueAtTime(0.7, time);
	this.oscEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
	this.osc.start(time)

	this.osc.stop(time + 1);
	this.noise.stop(time + 1);
};

var now = context.currentTime;

// var tom = new Tom1(context)
// tom.trigger(now)
// tom.trigger(now + .6)

// var kick = new Kick(context)
// kick.trigger(now)

// var snare = new Snare(context)
// snare.trigger(now)



function playNote(start=0, stop=1) {
  var gain = context.createGain();

  var oscillator = context.createOscillator();

  var waveArray = new Float32Array(4);
  waveArray[0] = 200;
  waveArray[1] = 400;
  waveArray[2] = 200;
  waveArray[3] = 400;


  oscillator.frequency.setValueCurveAtTime(waveArray, start, stop);

  var currentTime = context.currentTime;



  oscillator.connect(gain);


  gain.connect(context.destination);

  // var real = new Float32Array([0,0,0,0,1,0,0,0]);      // uncomment for tone variance
  // var imag = new Float32Array([0,1,0,0,0,1,0,0]);
  // var wave = context.createPeriodicWave(real, imag);
  // oscillator.setPeriodicWave(wave);
  oscillator.start(currentTime + start);
  oscillator.stop(currentTime + stop);
  oscillator.disconnect;
}

// playNote(0, 1)
