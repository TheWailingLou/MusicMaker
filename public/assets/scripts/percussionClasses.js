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

////////////////////////////////////////////////////////////////////////////////


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
