const kickStandards = [
  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0],
  [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0],
  [1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
  [1,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0],
  [1,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0],
  [1,0,1,0,0,0,0,0,1,1,0,0,0,0,0,0],
  [1,0,0,0,1,0,0,0,0,0,0,1,0,0,1,0],
  [1,0,0,0,1,0,0,0,0,0,0,1,0,0,1,0]
]

function kickStandardGen() {
  return kickStandards[Math.floor(Math.random()*kickStandards.length)]
}

function kickStandardIndex(i) {
  return kickStandards[i]
}
