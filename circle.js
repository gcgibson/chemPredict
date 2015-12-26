





//stochaistic algorithm for 2 dimensional case
var main = function(points){
for(var j = 0; j < 10000; j++){

    var chooseRandomAgent  = Math.floor(Math.random()*2)+1;

    var currPhi = agentAngle(chooseRandomAgent,points);
  //  console.log(currPhi);
    var randomMove = Math.random()*Math.PI*(2-.00001*j);
    currPhi += randomMove;
    currPhi = currPhi % 2*Math.PI;
    var newX = Math.cos(currPhi);
    var newY = Math.sin(currPhi);

   var oldArea = points[0].x*(points[1].y-points[2].y)+
          points[1].x*(points[2].y-points[0].y) +
          points[2].x*(points[0].y-points[1].y);
    oldArea = Math.abs(oldArea)/2;

    //randomly
    var keepx = points[chooseRandomAgent].x;
    var keepy = points[chooseRandomAgent].y;
    points[chooseRandomAgent].x = newX;
    points[chooseRandomAgent].y = newY;

      var newArea = points[0].x*(points[1].y-points[2].y)+
             points[1].x*(points[2].y-points[0].y) +
             points[2].x*(points[0].y-points[1].y);

       newArea = Math.abs(newArea)/2;

    if(newArea > oldArea){

    } else {
        points[chooseRandomAgent].x = keepx;
        points[chooseRandomAgent].y = keepy;
    }

}
}

function distanceBetweenTwoAgents(x1,x2,y1,y2){
  return Math.sqrt(sqr(x1-x2)+sqr(y1-y2) );
}

function agentAngle(a,points){
  return Math.atan2(points[a].y,points[a].x);
}

function radius(a1,points){
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

module.exports.main = main;
