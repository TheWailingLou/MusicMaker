const snareStandards = [
  [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
  [0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0],
  [0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0],
  [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
  [0,0,1,0,0,0,1,0,0,0,0,0,1,0,1,0],
  [0,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0],
  [0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0],
  [0,0,0,1,0,0,1,0,0,0,0,1,1,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
  [0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0]
]

function snareStandardGen() {
  return snareStandards[Math.floor(Math.random()*snareStandards.length)]
}

function snareStandardIndex(i) {
  return snareStandards[i]
}
