var numeric = require('numeric');

var previousnew = 0;




//stochaistic algorithm for 2 dimensional case
var main = function(points){
for(var j = 0; j < 1000; j++){

    var chooseRandomAgent  = Math.floor(Math.random()*4);

    var currPhi = Math.atan(points[chooseRandomAgent].y/(points[chooseRandomAgent].x + 1e-16));
    var currTheta = Math.acos(points[chooseRandomAgent].z);
  //  console.log(currPhi);
    var randomMovePhi = Math.random()*Math.PI*(2-.00001*j);
    var randomMoveTheta = Math.random()*Math.PI*(1-.00001*j);
    currPhi += randomMovePhi;
    currPhi = currPhi % 2*Math.PI;
    currTheta += randomMoveTheta;
    currTheta = currTheta % Math.PI;
    var newX = Math.sin(currTheta)*Math.cos(currPhi);
    var newY = Math.sin(currPhi)*Math.sin(currTheta);
    var newZ = Math.cos(currTheta);
    //  volume definition is 1/3  (the area of the base triangle)  (the height).


    var oldVolume =
    numeric.det([[points[0].x,points[1].x,points[2].x,points[3].x],[points[0].y,points[1].y,points[2].y,points[3].y],
  [points[0].z,points[1].z,points[2].z,points[3].z],[1,1,1,1]]);
  if(j % 999 ===0){

  }
    var cloneObj = clone(points);
    cloneObj[chooseRandomAgent].x = newX;
    cloneObj[chooseRandomAgent].y = newY;
    cloneObj[chooseRandomAgent].z = newZ;

    var newVol =
    numeric.det([[cloneObj[0].x,cloneObj[1].x,cloneObj[2].x,cloneObj[3].x],[cloneObj[0].y,
      cloneObj[1].y,cloneObj[2].y,cloneObj[3].y],
  [cloneObj[0].z,cloneObj[1].z,cloneObj[2].z,cloneObj[3].z],[1,1,1,1]]);
    if(Math.abs(newVol) > Math.abs(oldVolume)){
      points = clone(cloneObj);
    }



}
}
// console.log(points[0]);
// console.log(points[1]);
// console.log(points[2]);
// console.log(points[3]);
//is valid point


function distanceBetweenTwoAgents(x1,x2,y1,y2){
  return Math.sqrt(sqr(x1-x2)+sqr(y1-y2) );
}

function agentAngle(a){
  return Math.atan2(points[a].y,points[a].x);
}

function radius(a1){
  return Math.sqrt(sqr(points[a1].x)+sqr(points[a1].y) );
}

function angleBetweenTwoPoints(point1X, point1Y,
         point2X,  point2Y,
         fixedX,  fixedY) {

    var angle1 = Math.atan2(point1Y - fixedY, point1X - fixedX);
    var angle2 = Math.atan2(point2Y - fixedY, point2X - fixedX);

    return angle1 - angle2;
}

function sqr(x){
  return x*x;
}
function clone(a) {
   return JSON.parse(JSON.stringify(a));
}
module.exports.main = main;
