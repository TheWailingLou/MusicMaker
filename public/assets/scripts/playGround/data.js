var celloReal = celloReal.split(' ')
var celloRealArr = new Float32Array(celloReal.length);
celloReal.forEach(function(float, i){
  celloRealArr[i] = parseFloat(float);
})
console.log(celloRealArr[0])


var celloImag = celloImag.split(' ')
var celloImagArr = new Float32Array(celloImag.length);
celloImag.forEach(function(float, i){
  celloImagArr[i] = parseFloat(float);
})

console.log(celloImagArr[0])