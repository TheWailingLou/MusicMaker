function dramaticPausify(beatArray, dramaticPauseBegin=4) {
  return beatArray.map(function(num, i) {
    if (i > 16-dramaticPauseBegin) {
      return 0
    } else {
      return num;
    }
  })
}
