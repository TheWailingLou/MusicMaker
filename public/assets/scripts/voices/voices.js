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
}

SuperSquare.prototype.output = function() {
  return this.out
}



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
