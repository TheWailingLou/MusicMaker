function analyzeArray(binaryArray) {
  var halfCounts = 0;
  var quarterCounts = 0;
  var eighthCounts = 0;
  var teenthCounts = 0;
  var noteCount = 0;

  var longestSpace = -1;
  var currentLongestSpace = -1;
  var longestStreak = -1;
  var currentLongestStreak = -1;
  var longestSpaceEndsAt = 0;
  var longestStreakEndsAt = 0;

  binaryArray.forEach(function(num, i) {
    if (num === 1) {
      currentLongestStreak += 1;
      currentLongestSpace = 0;
      noteCount += 1
      if (i%8 === 0) {
        halfCounts += 1;
      } else if (i%4 === 0) {
        quarterCounts += 1;
      } else if (i%2 === 0) {
        eighthCounts += 1;
      } else {
        teenthCounts += 1;
      }
    } else {
      currentLongestStreak = 0;
      currentLongestSpace += 1;
    }
    if (currentLongestSpace > longestSpace) {
      longestSpace = currentLongestSpace;
      longestSpaceEndsAt = i;
    }
    if (currentLongestStreak > longestStreak) {
      longestStreak = currentLongestStreak;
      longestStreakEndsAt = i;
    }
  })

  var longestStreakBeginsAt = longestStreakEndsAt + 1 - longestStreak;
  var longestSpaceBeginsAt = longestSpaceEndsAt + 1 - longestSpace;

  var qHeavy = false;
  var eHeavy = false;
  var tHeavy = false;
  var nHeavy = false;

  var qPure = false;
  var ePure = false;
  var tPure = false;
  var nPure = false;

  if (quarterCounts+halfCounts === 4) {
    qHeavy = true
    qPure = true;
  }

  if (eighthCounts >= 3) {
    eHeavy = true;
    if (eighthCounts === 4 && qPure) {
      ePure = true;
    }
  }

  if (teenthCounts >= 3) {
    tHeavy = true;
    if (teenthCounts === 8 && ePure) {
      tPure = true;
    }
  }

  if (noteCount >= 8) {
    nHeavy = true;
  }


  var spatialized = false;
  var streaky = false;
  var nonStreaky = false;

  if (longestSpace >= 4) {
    spatialized = true;
  }

  if (longestStreak >= 4) {
    streaky = true;
  }

  if (!spatialized && !streaky) {
    nonStreaky = true;
  }


  var disjunct = false;
  var dull = false;
  var purityValidation = !qPure && !ePure && !tPure
  var notesInAll = halfCounts > 0 && quarterCounts > 0 &&
    eighthCounts > 0 && teenthCounts > 0;
  var streakQualifier = spatialized && noteCount >= 6 || streaky && noteCount <= 9;

  if (purityValidation && notesInAll && streakQualifier) {
    disjunct = true;
  }

  if (!purityValidation && !notesInAll && !streakQualifier) {
    dull = true;
  }

  var countTally = [halfCounts, quarterCounts, eighthCounts, teenthCounts, noteCount]
  var countHeavy = [qHeavy, eHeavy, tHeavy, nHeavy]
  var purity = [qPure, ePure, tPure]
  var streaks = [
    [longestStreak, longestStreakBeginsAt, longestStreakEndsAt],
    [longestSpace, longestSpaceBeginsAt, longestSpaceEndsAt]
  ]
  var spacing = [spatialized, streaky, nonStreaky]



  var analysis = {
    countTally,
    countHeavy,
    purity,
    streaks,
    spacing,
    disjunct
  }

  return analysis;
}
