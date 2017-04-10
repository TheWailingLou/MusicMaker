
$(document).ready(function(){
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext();
  var now = context.currentTime;

  var bufferSize = context.sampleRate
  var buffer = context.createBuffer(1, bufferSize, context.sampleRate)
  var data = buffer.getChannelData(0)
  for (var i=0; i<bufferSize; i++) {
    data[i] = Math.random();
  }



function noise(start) {
  decay = 0.1

  var gain = context.createGain();

  // add noise from buffer source.
  var node = context.createBufferSource();
  node.buffer = buffer;
  // node.loop = true;
  node.start(now + start);
  node.stop(now + start + decay);

  gain.gain.setValueAtTime(1, now + start)
  gain.gain.linearRampToValueAtTime(.1, now + start+decay)
  var filter = context.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(300, now + start);
  filter.frequency.linearRampToValueAtTime(800, now + start + decay)

  node.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination)

  ///

  var decay2 = 0.15

  var gain2 = context.createGain();

  var node2 = context.createBufferSource();
  node2.buffer = buffer;
  // node2.loop = true;
  node2.start(now + start);
  node2.stop(now + start + decay2);

  gain2.gain.setValueAtTime(1, now + start)
  gain2.gain.linearRampToValueAtTime(.05, now + start+decay2)
  var filter2 = context.createBiquadFilter();
  filter2.type = "highpass";
  filter2.frequency.setValueAtTime(1400, now + start);
  filter2.frequency.linearRampToValueAtTime(50, now + start + decay2)

  node2.connect(filter2);
  filter2.connect(gain2);
  gain2.connect(context.destination)


  //

  var decay3 = 0.24

  var gain3 = context.createGain();

  var node3 = context.createBufferSource();
  node3.buffer = buffer;
  // node3.loop = true;
  node3.start(now + start);
  node3.stop(now + start + decay3);

  gain3.gain.setValueAtTime(0.2, now + start)
  gain3.gain.linearRampToValueAtTime(.0001, now + start+decay3)
  var filter3 = context.createBiquadFilter();
  filter3.type = "highpass";
  filter3.frequency.setValueAtTime(3000, now + start);
  // filter3.frequency.linearRampToValueAtTime(3000, now + start + decay3)

  node3.connect(filter3);
  filter3.connect(gain3);
  gain3.connect(context.destination)
}


function snareTone(start) {
  var oscC = context.createOscillator();
  var oscA = context.createOscillator();
  var gainOscC = context.createGain();
  var gainOscA = context.createGain();

  var osc3 = context.createOscillator();
  var gainOsc3 = context.createGain();

  var osc4 = context.createOscillator();
  var gainOsc4 = context.createGain();

  oscC.type = "sine";
  oscC.frequency.value = 185.00;
  oscA.type = "sine";
  oscA.frequency.value = 880.33;//830.61;//739.99; //369.99;

  osc3.type = "sine";
  osc3.frequency.value = 92.50;

  osc4.type = "sine";
  osc4.frequency.value = 46.25;

  gainOscC.gain.setValueAtTime(.6, now + start);
  gainOscC.gain.linearRampToValueAtTime(.35, now + start + 0.08);
  gainOscC.gain.exponentialRampToValueAtTime(0.001, now + start + 0.18);

  gainOscA.gain.setValueAtTime(.0001, now + start);
  gainOscA.gain.exponentialRampToValueAtTime(0.0001, now + start + 0.5);
  gainOscA.gain.linearRampToValueAtTime(.001, now + start + 0.3)

  gainOsc3.gain.setValueAtTime(.15, now + start);
  gainOsc4.gain.linearRampToValueAtTime(.08, now + start + 0.1);
  gainOsc3.gain.exponentialRampToValueAtTime(0.001, now + start + 0.4);

  gainOsc4.gain.setValueAtTime(.15, now + start);
  gainOsc4.gain.linearRampToValueAtTime(.1, now + start + 0.1);
  gainOsc4.gain.exponentialRampToValueAtTime(0.001, now + start + 0.3);

  oscC.connect(gainOscC)
  oscA.connect(gainOscA)


  gainOscC.connect(context.destination)
  gainOscA.connect(context.destination)



  osc3.connect(gainOsc3)
  // filter.connect(gainOsc3)
  gainOsc3.connect(context.destination)

  osc4.connect(gainOsc4)
  gainOsc4.connect(context.destination)

  oscC.start(now + start)
  oscA.start(now + start)
  oscC.stop(now + start + 0.18)
  oscA.stop(now + start + 0.4)

  osc3.start(now + start)
  osc3.stop(now + start + 0.4)

  osc4.start(now + start)
  osc4.stop(now + start + 0.3)
}


// TODO: make snare take time and velocity as arguments
function snare(start=0) {
  snareTone(start)
  noise(start)
}


function kick(start=0) {

    var osc = context.createOscillator();
    var osc2 = context.createOscillator();
    var gainOsc = context.createGain();
    var gainOsc2 = context.createGain();

    osc.type = "sine";
    osc2.type = "sine";

    gainOsc.gain.setValueAtTime(1, context.currentTime);
    gainOsc.gain.exponentialRampToValueAtTime(0.001, now + start + 0.5);

    gainOsc2.gain.setValueAtTime(1, now + start);
    gainOsc2.gain.exponentialRampToValueAtTime(0.001, now + start + 0.5);

    osc.frequency.setValueAtTime(120, now + start);
    osc.frequency.exponentialRampToValueAtTime(0.001, now + start + 0.5);

    osc2.frequency.setValueAtTime(50, now + start);
    osc2.frequency.linearRampToValueAtTime(0.01, now + start + 1);

    osc.connect(gainOsc);
    osc2.connect(gainOsc2);
    gainOsc.connect(context.destination);
    gainOsc2.connect(context.destination);

    osc.start(now +start);
    osc2.start(now +start);

    osc.stop(now +start + 0.5);
    osc2.stop(now +start + 1);

    ////////////////////////////////


    var gain = context.createGain();
    var node = context.createBufferSource();

    node.buffer = buffer;
    // node.loop = true;
    node.start(now +start);
    node.stop(now +start +  .1);

    gain.gain.setValueAtTime(.8, now +start)
    // gain.gain.linearRampToValueAtTime(.1, now +start +decay)
    var filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, now +start);
    filter.frequency.linearRampToValueAtTime(150, now +start + .1)

    node.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination)



    ////////
    var decay2 = .15

    var gain2 = context.createGain();
    var node2 = context.createBufferSource();

    node2.buffer = buffer;
    // node2.loop = true;
    node2.start(now);
    node2.stop(now +  decay2);

    gain2.gain.setValueAtTime(.02, now)
    gain.gain.linearRampToValueAtTime(.001, now + decay2)
    var filter2 = context.createBiquadFilter();
    filter2.type = "lowpass";
    filter2.frequency.setValueAtTime(5000, now);
    filter2.frequency.linearRampToValueAtTime(1200, now + decay2)

    node2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(context.destination)



    ////

    var decay3 = 0.3

    var gain3 = context.createGain();

    var node3 = context.createBufferSource();
    node3.buffer = buffer;
    // node3.loop = true;
    node3.start(now + start);
    node3.stop(now + start + decay3);

    gain3.gain.setValueAtTime(0.01, now + start)
    gain3.gain.linearRampToValueAtTime(.0001, now + start + decay3)
    var filter3 = context.createBiquadFilter();
    filter3.type = "lowpass";
    filter3.frequency.setValueAtTime(3000, now);
    filter3.frequency.linearRampToValueAtTime(200, now + start  + decay3)

    node3.connect(filter3);
    filter3.connect(gain3);
    gain3.connect(context.destination)

};


function hiHat(start=0) {
  var fundamental = 40;
  var ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];






  ratios.forEach(function(ratio) {
    var bandpass = context.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 10000;

    var highpass = context.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 7000;

    var osc4 = context.createOscillator();
    var gain = context.createGain()

    gain.gain.setValueAtTime(1, now + start);
    gain.gain.exponentialRampToValueAtTime(0.01, now + start + 0.1);

    osc4.type = "square";
    osc4.frequency.value = fundamental * ratio;
    osc4.connect(gain);
    gain.connect(bandpass)
    bandpass.connect(highpass)
    highpass.connect(context.destination)

    osc4.start(now + start);
    osc4.stop(now + start + 0.1);

  });

  var decay3 = 0.1


  var gain3 = context.createGain();

  var node3 = context.createBufferSource();
  node3.buffer = buffer;
  // node3.loop = true;
  node3.start(now + start);
  node3.stop(now + start + decay3);

  gain3.gain.setValueAtTime(0.02, now + start)
  gain3.gain.linearRampToValueAtTime(.0001, now + start + decay3)
  var filter3 = context.createBiquadFilter();
  filter3.type = "lowpass";
  filter3.frequency.setValueAtTime(3000, now + start);
  var shimVal = 2000 + Math.random()*2000
  filter3.frequency.linearRampToValueAtTime(shimVal, now + start  + decay3)

  node3.connect(filter3);
  filter3.connect(gain3);
  gain3.connect(context.destination)
  gain3.disconnect(context.destination)
}








var n = 0
function slowLoad() {
  for (var j=0; j<128; j++) {
    setTimeout(function() {
      for (var i=(n*8); i<((n+1)*8); i++) {
        console.log(i)
        if ((i+1)%16 !== 0) {
          hiHat(i*0.3);
        }
        if (i%4 === 0 || (i-1)%8 === 0) {
          kick(i*0.3);
        }
        if ((i+2)%4 === 0) {
          hiHat((i*0.3) - 0.15);
          snare(i*0.3);
        }
        if ((i%32) > 28 && (i%32) < 31) {
          hiHat((i*0.3) - 0.15);
        }
        if (i%32 === 31) {

        }
      }
      n += 1;
    }, (2399 * j))
  }
}

slowLoad()



})
