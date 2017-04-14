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
