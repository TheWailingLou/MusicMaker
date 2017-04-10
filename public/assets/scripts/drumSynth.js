

$(document).ready(function(){
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext();
  var now = context.currentTime;



// function kickeh() {
//   var osc = context.createOscillator();
//   var osc2 = context.createOscillator();
//   var gainOsc1 = context.createGain();
//   var gainOsc2 = context.createGain();
//
//   osc.type = "triangle";
//   osc2.type = "sine";
//
//   gainOsc1.gain.setValueAtTime(1, now);
//   gainOsc1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
//
//   gainOsc2.gain.setValueAtTime(1, now);
//   gainOsc2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
//
//   osc.frequency.setValueAtTime(120, now);
//   osc.frequency.exponentialRampToValueAtTime(0.001, now + 0.5);
//
//   osc2.frequency.setValueAtTime(50, now);
//   osc2.frequency.exponentialRampToValueAtTime(0.001, now + 0.5);
//
//   osc.connect(gainOsc1);
//   osc2.connect(gainOsc2);
//   gainOsc1.connect(context.destination);
//   gainOsc2.connect(context.destination);
//
//   osc.start(now);
//   osc.stop(now + 0.5);
// }

// kick()

function noise(start) {
  decay = 0.1

  var gain = context.createGain();

  var node = context.createBufferSource();
  var bufferSize = context.sampleRate;
  var buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  var data = buffer.getChannelData(0);

  for (var i=0; i < bufferSize; i++) {
    data[i] = Math.random();
  }

  node.buffer = buffer;
  node.loop = true;
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

  var buffer2 = context.createBuffer(1, bufferSize, context.sampleRate);
  var data2 = buffer.getChannelData(0);

  for (var i=0; i < bufferSize; i++) {
    data2[i] = Math.random();
  }

  node2.buffer = buffer;
  node2.loop = true;
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

  var buffer3 = context.createBuffer(1, bufferSize, context.sampleRate);
  var data3 = buffer.getChannelData(0);

  for (var i=0; i < bufferSize; i++) {
    data2[i] = Math.random();
  }

  node3.buffer = buffer;
  node3.loop = true;
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

// c = [16.35, 32.70, 65.41, 130.81, 261.63
// a = [27.50, 55.00, 110.00, 220.00,

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





  // var filter = context.createBiquadFilter();
  // filter.type = "lowpass";
  // filter.frequency.value = 100

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

//
// function crunch(frequency, start=0, stop=1) {
//
//   var osc1 = context.createOscillator();
//   var osc2 = context.createOscillator();
//   var osc3 = context.createOscillator();
//   var osc4 = context.createOscillator();
//
//   var gainOsc1 = context.createGain();
//   var gainOsc2 = context.createGain();
//   var gainOsc3 = context.createGain();
//   var gainOsc4 = context.createGain();
//
//   osc1.type = "sine";
//   osc1.frequency.value = frequency;
//   osc2.type = "sine";
//   osc2.frequency.value = frequency/2;
//   osc3.type = "sine";
//   osc3.frequency.value = frequency * 2;
//   osc4.type = "sawtooth";
//   osc4.frequency.value = frequency * 4;
//
//   gainOsc1.gain.setValueAtTime(.6, now + start);
//   gainOsc2.gain.setValueAtTime(.15, now + start);
//   gainOsc3.gain.setValueAtTime(.1, now + start);
//   gainOsc4.gain.setValueAtTime(.05, now + start);
//
//
//   osc1.connect(gainOsc1)
//   osc2.connect(gainOsc2)
//   osc3.connect(gainOsc3)
//   osc4.connect(gainOsc4)
//
//   gainOsc1.connect(context.destination)
//   gainOsc2.connect(context.destination)
//   gainOsc3.connect(context.destination)
//   gainOsc4.connect(context.destination)
//
//   osc1.start(now + start)
//   osc1.stop(now + stop)
//   osc2.start(now + start)
//   osc2.stop(now + stop)
//   osc3.start(now + start)
//   osc3.stop(now + stop)
//   osc4.start(now + start)
//   osc4.stop(now + stop)
//
//
//
//   var gain = context.createGain();
//   var node = context.createBufferSource();
//   var bufferSize = context.sampleRate;
//   var buffer = context.createBuffer(1, bufferSize, context.sampleRate);
//   var data = buffer.getChannelData(0);
//
//   for (var i=0; i < bufferSize; i++) {
//     data[i] = Math.random();
//   }
//
//   node.buffer = buffer;
//   node.loop = true;
//   node.start(now + start);
//   node.stop(now + stop);
//
//   gain.gain.setValueAtTime(.2, now + start)
//   // gain.gain.linearRampToValueAtTime(.1, now + start+decay)
//   var filter = context.createBiquadFilter();
//   filter.type = "highpass";
//   filter.frequency.setValueAtTime(frequency, now + start);
//   // filter.frequency.linearRampToValueAtTime(800, now + decay)
//
//   node.connect(filter);
//   filter.connect(gain);
//   gain.connect(context.destination)
// }

// // crunch(110.00, 0, .5)
// snare(0)
// // crunch(32.7, .5, 1)
// snare(.5)
// // crunch(110, 1, 1.5)
// snare(1)
// snare(1.25)
// snare(1.375)
//
//
// // crunch(110.00, 2, 2.5)
// snare(2)
// // crunch(32.7, 2.5, 3)
// snare(2.5)
// // crunch(110, 3, 3.5)
// snare(3)
// snare(3.25)
// snare(3.375)

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
    var bufferSize = context.sampleRate;
    var buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    var data = buffer.getChannelData(0);

    for (var i=0; i < bufferSize; i++) {
      data[i] = Math.random();
    }

    node.buffer = buffer;
    node.loop = true;
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
    var buffer2 = context.createBuffer(1, bufferSize, context.sampleRate);
    var data2 = buffer2.getChannelData(0);

    for (var i=0; i < bufferSize; i++) {
      data2[i] = Math.random();
    }

    node2.buffer = buffer2;
    node2.loop = true;
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

    var buffer3 = context.createBuffer(1, bufferSize, context.sampleRate);
    var data3 = buffer.getChannelData(0);

    for (var i=0; i < bufferSize; i++) {
      data2[i] = Math.random();
    }

    node3.buffer = buffer;
    node3.loop = true;
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

    // setTimeout(function(){
    //   console.log("bass disconnected");
    //   gain3.disconnect(context.destination)
    //   gain2.disconnect(context.destination)
    //   gain.disconnect(context.destination)
    //   gainOsc.disconnect(context.destination);
    //   gainOsc2.disconnect(context.destination);
    //
    // }, start*1000 + 500)

};

// kick(0.0)
// kick(0.1)
// kick(0.2)
// kick(0.3)
// kick(0.4)
// kick(0.5)
// kick(0.6)
// kick(0.7)
// snare(0.7)

// kick(0.8)
// kick(0.9)
// kick(1.0)
// kick(1.1)
// kick(1.2)
// kick(1.3)
// kick(1.4)
// kick(1.5)
// snare(1.5)

// kick(1.6)
// kick(1.7)
// kick(1.8)
// kick(1.9)
// kick(2.0)
// kick(2.1)
// kick(2.2)
// kick(2.3)
// snare(2.3)

// kick(2.4)
// kick(2.5)
// kick(2.6)
// kick(2.7)
// kick(2.8)
// kick(2.9)
// kick(3.0)
// kick(3.1)

// kick(3.2)
// kick(3.3)
// kick(3.4)
// kick(3.5)
// kick(3.6)
// kick(3.7)
// kick(3.8)
// kick(3.9)
// snare(3.9)


// kick(4.0)
//
// kick(2)
// kick(2.5)
//
// snare(3.0)
// kick(3.5)


//
// kick(.8)
//
// snare(1.0)

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

    // setTimeout(function(){
    //   console.log("hihat disconected")
    //   highpass.disconnect(context.destination)
    // }, start*1000 + 100)


  });

  var decay3 = 0.1


  var gain3 = context.createGain();

  var node3 = context.createBufferSource();
  var bufferSize = context.sampleRate;

  var buffer3 = context.createBuffer(1, bufferSize, context.sampleRate);
  var data3 = buffer3.getChannelData(0);

  for (var i=0; i < bufferSize; i++) {
    data3[i] = Math.random();
  }

  node3.buffer = buffer3;
  node3.loop = true;
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

  // setTimeout(function(){
  //   console.log("hihatFuzz disconnected");
  //   gain3.disconnect(context.destination)
  // }, start*1000 + decay3)
}
// context.playing = function() {
//   console.log("yeah!")
// }
//
// for (var i=0; i<4; i++) {
//   // console.log(i)
//   if ((i+1)%16 !== 0) {
//     hiHat(i*0.3);
//   }
//   if (i%4 === 0 || (i-1)%8 === 0) {
//     kick(i*0.3)
//   }
//   if ((i+2)%4 === 0) {
//     hiHat((i*0.3) - 0.15)
//     snare(i*0.3)
//   }
//
//   if ((i%32) > 28 && (i%32) < 31) {
//     hiHat((i*0.3) - 0.15)
//     // hiHat(i*0.3)
//   }
// }
var n = 0
function slowLoad() {
  for (var j=0; j<4; j++) {
    // console.log(j)
    setTimeout(function() {
      // console.log("next loaded", j)
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


// setTimeout(function() {
//   console.log(kick)
//   for (var i=16; i<32; i++) {
//     console.log(i)
//     if ((i+1)%16 !== 0) {
//       hiHat(i*0.3);
//     }
//     if (i%4 === 0 || (i-1)%8 === 0) {
//       kick(i*0.3);
//     }
//     if ((i+2)%4 === 0) {
//       hiHat((i*0.3) - 0.15);
//       snare(i*0.3);
//     }
//
//     if ((i%32) > 28 && (i%32) < 31) {
//       hiHat((i*0.3) - 0.15);
//     }
//   }
// }, 1000)
//
// setTimeout(function() {
//   console.log(kick)
//   for (var i=32; i<48; i++) {
//     console.log(i)
//     if ((i+1)%16 !== 0) {
//       hiHat(i*0.3);
//     }
//     if (i%4 === 0 || (i-1)%8 === 0) {
//       kick(i*0.3);
//     }
//     if ((i+2)%4 === 0) {
//       hiHat((i*0.3) - 0.15);
//       snare(i*0.3);
//     }
//
//     if ((i%32) > 28 && (i%32) < 31) {
//       hiHat((i*0.3) - 0.15);
//     }
//   }
// }, 2000)
// //
// setTimeout(function() {
//   console.log(kick)
//   for (var i=48; i<64; i++) {
//     console.log(i)
//     if ((i+1)%16 !== 0) {
//       hiHat(i*0.3);
//     }
//     if (i%4 === 0 || (i-1)%8 === 0) {
//       kick(i*0.3);
//     }
//     if ((i+2)%4 === 0) {
//       hiHat((i*0.3) - 0.15);
//       snare(i*0.3);
//     }
//
//     if ((i%32) > 28 && (i%32) < 31) {
//       hiHat((i*0.3) - 0.15);
//     }
//   }
// }, 4000)
// //
// setTimeout(function() {
//   console.log(kick)
//   for (var i=64; i<80; i++) {
//     console.log(i)
//     if ((i+1)%16 !== 0) {
//       hiHat(i*0.3);
//     }
//     if (i%4 === 0 || (i-1)%8 === 0) {
//       kick(i*0.3);
//     }
//     if ((i+2)%4 === 0) {
//       hiHat((i*0.3) - 0.15);
//       snare(i*0.3);
//     }
//
//     if ((i%32) > 28 && (i%32) < 31) {
//       hiHat((i*0.3) - 0.15);
//     }
//   }
// }, 8000)
//
//
//
// setTimeout(function() {
//   console.log(kick)
//   for (var i=96; i<112; i++) {
//     console.log(i)
//     if ((i+1)%16 !== 0) {
//       hiHat(i*0.3);
//     }
//     if (i%4 === 0 || (i-1)%8 === 0) {
//       kick(i*0.3);
//     }
//     if ((i+2)%4 === 0) {
//       hiHat((i*0.3) - 0.15);
//       snare(i*0.3);
//     }
//
//     if ((i%32) > 28 && (i%32) < 31) {
//       hiHat((i*0.3) - 0.15);
//     }
//   }
// }, 1200)
//
//
// setTimeout(function() {
//   console.log(kick)
//   for (var i=112; i<128; i++) {
//     console.log(i)
//     if ((i+1)%16 !== 0) {
//       hiHat(i*0.3);
//     }
//     if (i%4 === 0 || (i-1)%8 === 0) {
//       kick(i*0.3);
//     }
//     if ((i+2)%4 === 0) {
//       hiHat((i*0.3) - 0.15);
//       snare(i*0.3);
//     }
//
//     if ((i%32) > 28 && (i%32) < 31) {
//       hiHat((i*0.3) - 0.15);
//     }
//   }
// }, 1200)



// for (var i=64; i<128; i++) {
//   // console.log(i)
//   if ((i+1)%16 !== 0) {
//     hiHat(i*0.3);
//   }
//   if (i%4 === 0 || (i-1)%8 === 0) {
//     kick(i*0.3)
//   }
//   if ((i+2)%4 === 0) {
//     hiHat((i*0.3) - 0.15)
//     snare(i*0.3)
//   }
//
//   if ((i%32) > 28 && (i%32) < 31) {
//     hiHat((i*0.3) - 0.15)
//     // hiHat(i*0.3)
//   }
// }
// hiHat(0)
// hiHat(.3)
// hiHat(.6)
// hiHat(.9)
// hiHat(1.2)



})

















//
