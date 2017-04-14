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




  console.log(`hiHatOpenings: ${hiHatOpenings}`)
  console.log(hiHatArray)
  console.log(bassArray)
  console.log(snareArray)
  console.log(hiHatArray2)
  console.log(bassArray2)
  console.log(snareArray2)

  crash1.trigger(32*4*0.5+0.1)

  var beatSwitch = true;
  for (var i=0; i<32; i++) {
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
        percussionRead(dramaticPausify(bassArray, 8), kick, i)
        percussionRead(dramaticPausify(snareArray, 8), snare, i)
        var tomFill = generateTomFill(8)
        console.log(tomFill)
        tomFillRead(tomFill, toms, i)
      } else {
        hiHatRead(hiHatArray, hiHatOpenings, hiHat, i)
        percussionRead(bassArray, kick, i)
        percussionRead(snareArray, snare, i)
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
})

var muted = false;
$(document).keydown(function(event){
  if (event.which === 32) {
    if (!muted) {
      masterOut.gain.value = 0;
      muted = true;
    } else {
      masterOut.gain.value = 1;
      muted = false;
    }
  }
})
