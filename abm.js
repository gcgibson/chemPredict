var system= require('sys');
var plotly = require('plotly')('casey.gibson','ccamapj4tx');
var circ = require('./circle.js');
var sphere = require('./sphere.js');
// H1         H3
//     C1= C2
// H2          H4
//

// H BR


//when bonds form energy is released and the system is more stable
//two heuristics --- maximize bond angle to minimize electron eclectron repulsion
// maximize bond order to maximize bond stability
var testIndex = 0;
var agents  = [
  {name:"C1_1",nbors:["C2_1","H1_1","H2_1"], mol:1, eneg: 2 ,x:0,y:0,z:0},
  {name:"C2_1",nbors:["C1_1","H3_1","H4_1"], mol: 1, eneg: 2,x:0,y:0,z:0},
  {name:"H1_1",nbors:["C1_1"], mol:1, eneg: 1,x:0,y:0,z:0},
  {name:"H2_1",nbors:["C1_1"] , mol:1, eneg: 1,x:0,y:0,z:0},
  {name:"H3_1",nbors:["C2_1"] , mol:1, eneg: 1,x:0,y:0,z:0},
  {name:"H4_1",nbors:["C2_1"], mol:1, eneg: 1,x:0,y:0,z:0},
  {name:"H1_2",nbors:["Br1_2"], mol:2, eneg: 1,x:0,y:0,z:0},
  {name:"Br1_2",nbors:["H1_2"], mol:2, eneg: 3,x:0,y:0,z:0}
        ];

//initialize agent space
for (var agentIter = 0; agentIter < agents.length; agentIter++){
  agents[agentIter].x = Math.random()*12;
  agents[agentIter].y = Math.random()*12;
  agents[agentIter].z = Math.random()*12;
}

for(var i = 0; i < 10000; i++){
  if(i % 21 ===0){
    console.log(i);
  }
  var xU1 = Math.random()*12;
  var yU1 = Math.random()*12;
  var zU1 = Math.random()*12;
  var xU2 = Math.random()*12;
  var yU2 = Math.random()*12;
  var zU2 = Math.random()*12;
  //move agents randomly
  for(var j = 0; j < agents.length; j++){
    if(agents[j].mol === 1){
      agents[j ].x = (agents[j].x+ xU1) %12;
      agents[j].y = (agents[j].y+yU1) %12;
      agents[j].z = (agents[j].z+zU1) %12;
    } else {
      agents[j].x = (agents[j].x+xU2) %12;
      agents[j].y = (agents[j].y+yU2) %12;
      agents[j].z = (agents[j].z+zU2) %12;
    }
  }
  //console.log(agents[0].x,agents[0].y,agents[0].z);
  //check for agent interaction
  //console.log(agents);
  checkAgents();
  //now we need to algin agents in space if any bonding has occured
  checkSpatialArrangments(1);
  checkSpatialArrangments(2);


}
console.log(agents);
//console.log(agents);
function checkSpatialArrangments(moln){
  //find most chiral center of first molecule
  var indexOfHighestChiral = 10;
  var highestChiral = 0;
  for(var i = 0; i < agents.length; i++){
    if(agents[i].mol === moln){
      var candidate = agents[i].nbors.length;
      if(candidate > highestChiral){
        indexOfHighestChiral = i;
        highestChiral = candidate;
      }

    }
  }
  var neighborsOfChiral = [];
  for(var j= 0; j < agents[indexOfHighestChiral].nbors.length; j++){
    for(var k = 0; k < agents.length; k++){
    //  console.log(agents[k].name);
      if(agents[indexOfHighestChiral].nbors[j]===
          agents[k].name
      ){
        neighborsOfChiral.push(agents[k]);
      }
    }
  }
  if(neighborsOfChiral.length === 3){
    circ.main(neighborsOfChiral);

  } else if(neighborsOfChiral.length === 4){

    sphere.main(neighborsOfChiral);

  }
}
function checkAgents(){
  for(var i = 0; i < agents.length; i++){
    var closeAgents = getNearbyAgents(i);
    if(closeAgents.length > 0){
      if(numNbors(agents[i]) < bondLookUp(agents[i].name)){
        //agent i can accpet a bond
        //so we change the mol of the agent
        //remove it from all nbor list of other mol
        //add it to nbor list of current agent
        var indexToGrab = Math.floor(Math.random()*closeAgents.length);
       testIndex = i;

        for(var agentsIter2 = 0; agentsIter2 < agents.length; agentsIter2++){
          if(agents[agentsIter2] !== agents[i].mol){
            for(var k = 0; k < agents[agentsIter2].nbors.length; k++){
              if(agents[agentsIter2].nbors[k] === closeAgents[indexToGrab].name){
                agents[agentsIter2].nbors.splice(k,1);
              }
            }
          }
        }
        agents[i].nbors.push(closeAgents[indexToGrab].name);
          closeAgents[indexToGrab].nbors=(agents[i].name);

        closeAgents[indexToGrab].mol === agents[i].mol;


      }
    }


  }
}

function getNearbyAgents(i){
  var nba = [];
  var offest = .5 ;
  for(var j = 0; j < agents.length; j++){
      if(agents[i].mol ===1 && agents[j].mol === 2){
        if(Math.abs(agents[i].x-agents[j].x) < offest && Math.abs(agents[i].y-agents[j].y) <offest  && Math.abs(agents[i].z-agents[j].z) <offest){
          //we have two agents from differnect molecules that are sufficeitnly close
          nba.push(agents[j]);
        }
      }
  }
  return nba;
}
function numNbors(agent){
  return agent.nbors.length;
}

function bondLookUp(element){
  if(element.indexOf("C") > -1){
    return 4;
  }
  if(element.indexOf("H") > -1){
    return 1;
  }
  if(element.indexOf("Br") > -1){
    return 1;
  }
}
