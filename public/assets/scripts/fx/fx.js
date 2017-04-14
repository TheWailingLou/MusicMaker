////////////////////////////////////////////////////////////////////////////////
/*                                                                            */
/*                                                                            */
////////////////////////////////////////////////////////////////////////////////
/*
  INCLUDED:
    Echo
    Verb
    LFO PhaseShift
    Binaural

  TO USE:
    create an instance of the processor
    call passThru on it,
    the output of passThru is a gainNode that can then be connected to wherever.

  EXAMPLE:
    var echo = new Echo(context);
    echo.passThru(oscillator).connect(context.destination)
*/
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function Echo(context) {
  this.context = context
}

Echo.prototype.setup = function(delayTime=0.4, dryGain=1, wetGain=0.5) {
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

Echo.prototype.passThru = function(inputNode, delayTime=0.4, dryGain=1, wetGain=0.5) {
  this.setup(delayTime, dryGain, wetGain)
  inputNode.connect(this.dry)
  inputNode.connect(this.delay)
  return this.out
}

////////////////////////////////////////////////////////////////////////////////

function Verb (context, verbDuration=2.0, decay=2.0) {
  this.context = context;
  this.sampleRate = this.context.sampleRate;
  this.length = this.sampleRate * verbDuration;
  this.impulse = this.context.createBuffer(2, this.length, this.sampleRate);
  this.impulseL = this.impulse.getChannelData(0);
  this.impulseR = this.impulse.getChannelData(1);
  this.decay = decay;
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

////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////

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
  return this.out
}
