window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var masterOut = context.createGain();
var compareSwitch = context.createGain();
compareSwitch.gain.value = 0;
compareSwitch.connect(context.destination)
masterOut.gain.value = 1;
masterOut.connect(context.destination)

var now = context.currentTime;




function Delay(context) {
  this.context = context
}

Delay.prototype.setup = function(delayTime=0.4, dryGain=1, wetGain=0.5) {
  this.dry = this.context.createGain()
  this.wet = this.context.createGain()
  this.out = this.context.createGain()
  this.dry.gain.value = dryGain;
  this.wet.gain.value = wetGain;

  this.delay = this.context.createDelay()
  this.delay.delayTime.value = delayTime
  this.delay.connect(this.wet)
  this.wet.connect(this.out)
  this.dry.connect(this.out)
}

Delay.prototype.passThru = function(inputNode, delayTime=0.4, dryGain=1, wetGain=0.5) {
  this.setup(delayTime, dryGain, wetGain)
  inputNode.connect(this.dry)
  inputNode.connect(this.delay)
  return this.out
}

function Verb (context, verbDuration=2.0) {
  this.context = context;
  this.sampleRate = this.context.sampleRate;
  this.length = this.sampleRate * verbDuration;
  this.impulse = this.context.createBuffer(2, this.length, this.sampleRate);
  this.impulseL = this.impulse.getChannelData(0);
  this.impulseR = this.impulse.getChannelData(1);
  this.decay = 2.0;
  for (var i=0; i<this.length; i++) {
    this.impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1-i/this.length, this.decay);
    this.impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1-i/this.length, this.decay);
  }
}

Verb.prototype.setup = function(dryGain=1, wetGain=0.5) {
  this.wet = this.context.createGain()
  this.dry = this.context.createGain()
  this.out = this.context.createGain()
  this.wet.gain.value = wetGain
  this.dry.gain.value = dryGain
  this.verb = this.context.createConvolver()
  this.verb.buffer = this.impulse
  this.verb.connect(this.wet)
  this.wet.connect(this.out)
  this.dry.connect(this.out)
}

Verb.prototype.passThru = function(inputNode, dryGain=1, wetGain=0.5) {
  this.setup(dryGain, wetGain)
  inputNode.connect(this.verb)
  inputNode.connect(this.dry)
  return this.out
}





var verb = new Verb(context)

var delay = new Delay(context, 0.15)

// var phaser = new Phase(context)


function Bass(context) {
  this.context = context;
  this.out = this.context.createGain()
}

Bass.prototype.setup = function(velocity=1) {
  this.osc1 = this.context.createOscillator()
  this.osc2 = this.context.createOscillator()
  this.gain1 = this.context.createGain()
  this.gain2 = this.context.createGain()

  this.osc1.type = "triangle"
  this.osc2.type = "triangle"

  var variant = Math.random()*0.3
  this.velocity = velocity - variant;

  this.bassify1 = this.context.createBiquadFilter();
  this.bassify1.type = "lowpass";
  this.bassify2 = this.context.createBiquadFilter();
  this.bassify2.type = "lowpass";

  this.osc1.connect(this.gain1);
  this.osc2.connect(this.gain2);
  // this.bassify1.connect(this.gain1)
  // this.bassify2.connect(this.gain2)
  this.gain1.connect(this.out)
  this.gain2.connect(this.out)
  // delay.passThru(this.gain1)
  // delay.passThru(this.gain2)
}

Bass.prototype.envelope = function(start, duration) {
  this.decay = 5.0
  this.gain1.gain.setValueAtTime(0.1, start+now);
  this.gain2.gain.setValueAtTime(0.1, start+now);
  this.gain1.gain.exponentialRampToValueAtTime(this.velocity, start+now+0.01)
  this.gain2.gain.exponentialRampToValueAtTime(this.velocity, start+now+0.01)
  this.gain1.gain.linearRampToValueAtTime(0.001, start+now+this.decay)
  this.gain2.gain.linearRampToValueAtTime(0.001, start+now+this.decay)
  this.gain1.gain.exponentialRampToValueAtTime(0.2, start+now+duration-0.02)
  this.gain2.gain.exponentialRampToValueAtTime(0.2, start+now+duration-0.02)
}

Bass.prototype.trigger = function(note, start=0, duration=0.5) {
  this.setup()
  this.envelope(start, duration)
  var frequency1 = Math.pow(2, (note - 69) / 12) * 440.0;
  var frequency2 = Math.pow(2, ((note + 12) - 69) / 12) * 440.0;
  this.osc1.frequency.value = frequency1
  this.osc2.frequency.value =  frequency2
  this.bassify1.frequency.value = frequency1 + 5;
  this.bassify2.frequency.value = frequency2 + 5;
  this.osc1.start(now + start)
  this.osc2.start(now + start)
  this.osc1.stop(now + start + duration)
  this.osc2.stop(now + start + duration)
}

Bass.prototype.output = function() {
  return this.out
}

var bass = new Bass(context);

// [21-45] is a good range
// var triggerredBass = bass.returnOsc(now, 2, 45)
// phaser.passThru(triggerredBass).connect(masterOut)
// triggerredBass.connect(masterOut)

function SuperSquare(context, numOfSquares, detune) {
  this.context = context;
  this.maxGainVal = 1/numOfSquares;
  this.numOfSquares = numOfSquares;
  this.detuneVal = detune;
  this.out = this.context.createGain()
  this.out.gain.value = this.maxGainVal;
}

SuperSquare.prototype.setup = function() {
  this.squares = []
  for (var i=0; i<this.numOfSquares; i++) {
    var square = this.context.createOscillator()
    square.type = "square";
    square.detune.value = - this.detuneVal + (i * 2 * this.detuneVal /(this.numOfSquares - 1))
    this.squares.push(square)
    square.connect(this.out)
  }
}

SuperSquare.prototype.trigger = function(note, start=0, duration=1) {
  this.setup()
  var frequency = Math.pow(2, (note - 69) / 12) * 440.0;
  this.squares.forEach(function(square){
    square.frequency.value = frequency
    square.start(now + start);
    square.stop(now + start + duration)
  })
  // this.out.connect(masterOut)
}
SuperSquare.prototype.output = function() {
  return this.out
}


// var square = new SuperSquare(context, 17, 6)
//ideal in the [49-61] range

// for (var i=0; i<4; i++) {
//   square.trigger(12+43, 0+(i*4.8), 0.3)
//   square.trigger(12+46, 0.3+(i*4.8), 0.3)
//   square.trigger(12+50, 0.6+(i*4.8), 0.6)
//   square.trigger(12+43, 1.2+(i*4.8), 0.3)
//   square.trigger(12+46, 1.5+(i*4.8), 0.3)
//   square.trigger(12+48, 1.8+(i*4.8), 3.0)
// }
// square.output().connect(masterOut)
// delay.passThru(square.output()).connect(masterOut)

function LfoHfo(context) {
  this.context = context
}

LfoHfo.prototype.setup = function() {
  this.hfo = this.context.createOscillator()

  this.lfo1 = this.context.createOscillator()
  this.lfo2 = this.context.createOscillator()
  this.lfo1Gain = this.context.createGain()
  this.lfo2Gain = this.context.createGain()
  this.gainBoost = this.context.createGain()

  this.gainBoost.gain.value = 10;


  this.vcf = this.context.createBiquadFilter()
  this.vcf.type = "bandpass"
  this.vcf.Q = 10
  this.vcf2 = this.context.createBiquadFilter()
  this.vcf2.type = "bandpass"
  this.vcf2.Q.value = 20
  // this.vcf2.type = "lowpass"

  this.out = this.context.createGain()

  this.lfo1Gain.connect(this.vcf.frequency)
  // this.lfo1Gain.connect(this.vcf2.frequency)
  this.lfo2Gain.connect(this.vcf2.frequency)

  this.hfo.connect(this.vcf)
  this.hfo.connect(this.vcf2)
  this.vcf.connect(this.out)
  this.vcf2.connect(this.gainBoost)
  this.gainBoost.connect(this.out)
  this.lfo1.connect(this.lfo1Gain)
  this.lfo2.connect(this.lfo2Gain)



  this.out.gain.value = 1;
  this.hfo.type = "triangle"
  this.lfo1.type = "sine"
  this.lfo2.type = "sine"

  this.out.connect(masterOut)
}

LfoHfo.prototype.trigger = function(note=57, start=0, duration=1) {
  this.setup()
  var frequency = Math.pow(2, ((note) - 69) / 12) * 440.0;
  var frequency2 = 2000//Math.pow(2, ((note+36) - 69) / 12) * 440.0;
  this.vcf.frequency.setValueAtTime(200, now+start)
  this.vcf2.frequency.setValueAtTime(2000, now+start)
  this.hfo.frequency.setValueAtTime(frequency, now+start)  ;
  this.lfo1.frequency.setValueAtTime(0.5, now+start)
  this.lfo2.frequency.setValueAtTime(0.2, now+start)
  this.lfo1Gain.gain.setValueAtTime(100, now+start)
  this.lfo2Gain.gain.setValueAtTime(1000, now+start)
  this.hfo.start(now+start)
  this.hfo.stop(now+start+duration);
  this.lfo1.start(now+start)
  this.lfo1.stop(now+start+duration);
  this.lfo2.start(now+start)
  this.lfo2.stop(now+start+duration);
}

// var osc = new LfoHfo(context)

// osc.trigger(45, 0, 10)

function Phaser(context) {
  this.context = context;
  this.out = this.context.createGain()
}

Phaser.prototype.setup = function(lfo1=0.5, lfo2=.5, lfo3=0.5) {
  this.wet = this.context.createGain()
  this.dry = this.context.createGain()
  this.in = this.context.createGain()

  this.wet.gain.value = 1.0
  this.dry.gain.value = 0.8
  this.out.gain.value = 1.0
  this.in.gain.value = 1.0

  this.lfo1 = this.context.createOscillator()
  this.lfo2 = this.context.createOscillator()
  this.lfo3 = this.context.createOscillator()

  this.lfo1.frequency.value = lfo1
  this.lfo2.frequency.value = lfo2
  this.lfo3.frequency.value = lfo3


  this.lfo1.type = "sine"
  this.lfo2.type = "sine"
  this.lfo3.type = "sine"

  this.lfo1Gain = this.context.createGain()
  this.lfo2Gain = this.context.createGain()
  this.lfo3Gain = this.context.createGain()

  this.dcf1 = this.context.createBiquadFilter()
  this.dcf2 = this.context.createBiquadFilter()
  this.dcf3 = this.context.createBiquadFilter()

  this.dcf1.type = "bandpass"
  this.dcf1.Q.value = 0.5;
  this.dcf2.type = "bandpass"
  this.dcf2.Q.value = 20;
  this.dcf3.type = "bandpass"
  this.dcf3.Q.value = 10;

  this.lfo1Gain.gain.value = 20;
  this.lfo2Gain.gain.value = 80;
  this.lfo3Gain.gain.value = 1000;

  this.lfo1.connect(this.lfo1Gain)
  this.lfo2.connect(this.lfo2Gain)
  this.lfo3.connect(this.lfo3Gain)

  this.lfo1Gain.connect(this.dcf1.frequency)
  this.lfo2Gain.connect(this.dcf2.frequency)
  this.lfo3Gain.connect(this.dcf3.frequency)

  this.in.connect(this.dcf1)
  this.in.connect(this.dcf2)
  this.in.connect(this.dcf3)

  this.gainBoost = this.context.createGain()
  this.gainBoost.gain.value = 10;
  this.gainBoost2 = this.context.createGain()
  this.gainBoost2.gain.value = 5;
  this.dcf1.connect(this.wet)
  this.dcf2.connect(this.gainBoost)
  this.dcf3.connect(this.gainBoost)
  this.gainBoost.connect(this.wet)


  this.wet.connect(this.out)
  this.dry.connect(this.out)
}

Phaser.prototype.passThru = function(inputNode, frequencyPeak=100, bandpass1=600, bandpass2=2000) {
  this.setup()
  this.lfo1.start(now)
  this.lfo2.start(now)
  this.lfo3.start(now)
  this.dcf1.frequency.setValueAtTime(frequencyPeak, now)
  this.dcf2.frequency.setValueAtTime(bandpass1, now)
  this.dcf3.frequency.setValueAtTime(bandpass2, now)

  inputNode.connect(this.in)
  return this.out
}




function Binaural(context) {
  this.context = context;
}

Binaural.prototype.setup = function() {
  this.out = this.context.createGain()

  this.lfo = this.context.createOscillator()
  this.lfoGain = this.context.createGain()
  this.panner = this.context.createStereoPanner()

  this.panner.pan.value = 0
  this.lfo.type = "sine"

  this.lfo.connect(this.lfoGain)
  this.lfoGain.connect(this.panner.pan)
  this.panner.connect(this.out)
}

Binaural.prototype.passThru = function(inputNode, frequency=2, intensity=.7) {
  this.setup()
  inputNode.connect(this.panner);

  this.lfoGain.gain.value = intensity;
  this.lfo.frequency.value = frequency;
  this.lfo.start(now)
}

Binaural.prototype.output = function() {
  return this.out
}

var bin = new Binaural(context);

var phaser = new Phaser(context)

// var square = new SuperSquare(context, 17, 6)
var square = new Bass(context)
//ideal in the [49-61] range

// for (var i=0; i<4; i++) {
//   square.trigger(43, 0+(i*4.8), 0.3)
//   square.trigger(46, 0.3+(i*4.8), 0.3)
//   square.trigger(50, 0.6+(i*4.8), 0.6)
//   square.trigger(43, 1.2+(i*4.8), 0.3)
//   square.trigger(46, 1.5+(i*4.8), 0.3)
//   square.trigger(48, 1.8+(i*4.8), 3.0)
// }


// square.trigger(40, 0, 0.3)
// bin.passThru(square.output())
// .connect(masterOut)
// phaser.passThru(square.output()).connect(masterOut)



function ShepardsTone(context) {
  this.context = context;
}

ShepardsTone.prototype.setup = function(numOfVoices=8) {
  this.out = this.context.createGain()
  this.numOfVoices = numOfVoices;
  this.highpass = this.context.createBiquadFilter()
  this.highpass.type = "highpass"

  this.cycleLength = 30

  this.oscillators = []
  this.lfos = []
  this.lfos2 = []
  this.oscGains = []
  this.lfoGains = []
  this.gainGains = []
  this.offsets = []

  for (var i=0; i<this.numOfVoices; i++) {
    var osc = this.context.createOscillator()
    var lfo1 = this.context.createOscillator()
    var lfo2 = this.context.createOscillator()

    var oscGain = this.context.createGain()
    var lfoGain = this.context.createGain()
    var gainGain = this.context.createGain()

    var offset = this.context.createDelay()


    lfo1.type = "sawtooth"
    lfo2.type = "triangle"
    lfo1.frequency.value = 1/this.cycleLength
    lfo2.frequency.value = 1/this.cycleLength
    lfoGain.gain.value = 220
    gainGain.gain.value = 1/(this.numOfVoices*7/8)

    // offset.delayTime.value = (this.cycleLength/this.numOfVoices) * i

    oscGain.gain.value = 1/(this.numOfVoices*8)



    // lfo1.connect(offset)
    lfo1.connect(lfoGain)
    lfo2.connect(gainGain)
    // offset.connect(lfoGain)
    // offset.connect(gainGain)

    lfoGain.connect(osc.frequency)
    gainGain.connect(oscGain.gain)

    osc.connect(oscGain);
    oscGain.connect(this.highpass)

    this.oscillators.push(osc)
    this.lfos.push(lfo1)
    this.lfos2.push(lfo2)
    this.oscGains.push(oscGain)
    this.lfoGains.push(lfoGain)
    this.gainGains.push(gainGain)
    this.offsets.push(offset)
  }

  this.out.gain.value = 0.4;
  this.highpass.connect(this.out)
  this.out.connect(masterOut)
}


ShepardsTone.prototype.trigger = function(frequency) {
  this.setup()
  var cycleLength = this.cycleLength
  var numOfVoices = this.numOfVoices
  var lfos = this.lfos
  var lfos2 = this.lfos2
  this.highpass.frequency.value = frequency

  this.oscillators.forEach(function(osc, i) {
    var n = (2**((i%2)+1))/2
    osc.frequency.value = frequency * n;
    osc.start(now)
    osc.stop(now+30)
    lfos2[i].start(now + ((cycleLength/numOfVoices) * i))
    lfos2[i].stop(now + 30)
    lfos[i].start(now + ((cycleLength/numOfVoices) * i))
    lfos[i].stop(now + 30)
  })

  // this.osc1.frequency.value = frequency
  // this.osc2.frequency.value = frequency
  // this.osc3.frequency.value = frequency
  //
  // this.lfo1.start(now)
  // this.lfo2.start(now)
  // this.lfo3.start(now)
  //
  // this.lfo1.stop(now + 5)
  // this.lfo2.stop(now + 5)
  // this.lfo3.stop(now + 5)
  //
  // this.osc1.start(now)
  // this.osc2.start(now)
  // this.osc3.start(now)
  //
  // this.osc1.stop(now + 5)
  // this.osc2.stop(now + 5)
  // this.osc3.stop(now + 5)
  //
  this.out.connect(masterOut)

}

var sheptone = new ShepardsTone(context)

// sheptone.trigger(440)





///
