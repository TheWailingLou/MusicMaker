
function generateTomFill(numOfTeenths) {
  var tomArray = [];
  var cap;
  var downward = Math.random() < 0.7;
  // console.log(`downward: ${downward}`)
  if (downward) {
    cap = 4;
  } else {
    cap = 0;
  }
  var tomLast = 0;
  var streak = 0;
  var hitStreak = 0;
  for (var i=0; i<16; i++) {
    if (i <= (16 - numOfTeenths) || i===15) {
      tomArray.push(0);
    } else {
      var silence = Math.random() < 0.3;
      var tomNum;
      if (silence) {
        tomNum = 0;
      } else {
        if (downward) {
          tomNum = Math.floor(Math.random()*(cap+1));
        } else {
          tomNum = Math.floor(Math.random()*(4-cap))+cap;
        }
        tomNum += 1;
      }

      // checks if the last tom hit was the same as this one.
      if (tomLast === tomNum) {
        streak += 1;
      } else {
        streak = 0;
      }

      // if the same tom is hit 3 times in a row, the 4th one will be different.
      if (streak > 3) {
        tomNum += 2;
        tomNum %= 5;
      }

      // checks how many times any tom has been hit without silence.
      if (tomNum !== 0) {
        hitStreak += 1;
        if (hitStreak >= 4) {
          tomNum = 0;
          hitStreak = 0;
        } else {
          cap = tomNum-1;
        }
      }

      tomLast = tomNum;

      tomArray.push(tomNum);
    }
  }
  return tomArray
}
