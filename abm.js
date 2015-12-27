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
var spatialOn = false;
var runlogger = false;

// /***AGENTS FOR ADDITION REACTION****/
// var agents  = [
//   {name:"C1_1",nbors:["C2_1","H1_1","H2_1"], mol:1, eneg: 2 ,x:0,y:0,z:0},
//   {name:"C2_1",nbors:["C1_1","H3_1","H4_1"], mol: 1, eneg: 2,x:0,y:0,z:0},
//   {name:"H1_1",nbors:["C1_1"], mol:1, eneg: 1,x:0,y:0,z:0},
//   {name:"H2_1",nbors:["C1_1"] , mol:1, eneg: 1,x:0,y:0,z:0},
//   {name:"H3_1",nbors:["C2_1"] , mol:1, eneg: 1,x:0,y:0,z:0},
//   {name:"H4_1",nbors:["C2_1"], mol:1, eneg: 1,x:0,y:0,z:0},
//   {name:"H1_2",nbors:["Br1_2"], mol:2, eneg: 1,x:0,y:0,z:0},
//   {name:"Br1_2",nbors:["H1_2"], mol:2, eneg: 3,x:0,y:0,z:0}
//         ];
/***AGENTS FOR ELIMATION ****/
var agents  = [
  {name:"C1_1",nbors:["C2_1","H1_1","H2_1","H3_1"], mol:1, eneg: 2 ,x:0,y:0,z:0},
  {name:"C2_1",nbors:["C1_1","H4_1","Br1_1","C3_1"], mol: 1, eneg: 2,x:0,y:0,z:0},
  {name:"C3_1",nbors:["H5_1","C2_1","H6_1","H7_1"], mol:1, eneg: 1,x:0,y:0,z:0},
  {name:"H1_1",nbors:["C1_1"] , mol:1, eneg: 1,x:0,y:0,z:0},
  {name:"H2_1",nbors:["C2_1"] , mol:1, eneg: 1,x:0,y:0,z:0},
  {name:"H3_1",nbors:["C2_1"], mol:1, eneg: 1,x:0,y:0,z:0},
  {name:"H4_1",nbors:["C2_1"], mol:1, eneg: 1,x:0,y:0,z:0},
  {name:"Br1_1",nbors:["C2_1"], mol:1, eneg: 3,x:0,y:0,z:0},
  {name:"H5_1",nbors:["C3_1"], mol:1, eneg: 1,x:0,y:0,z:0},
  {name:"H6_1",nbors:["C3_1"], mol:1, eneg: 1,x:0,y:0,z:0},
  {name:"H7_1",nbors:["C3_1"], mol:1, eneg: 1,x:0,y:0,z:0},
  {name:"O1_2",nbors:["C1_2"], mol:2, eneg: 4,x:0,y:0,z:0},
  {name:"C1_2",nbors:["O1_2","H1_2","H2_2","H3_2"], mol:2, eneg: 2,x:0,y:0,z:0},
  {name:"H1_2",nbors:["C1_2"], mol:2, eneg: 1,x:0,y:0,z:0},
  {name:"H2_2",nbors:["C1_2"], mol:2, eneg: 1,x:0,y:0,z:0},
  {name:"H3_2",nbors:["C1_2"], mol:2, eneg: 1,x:0,y:0,z:0},
];

        for(var j = 0; j < agents.length; j++){
          if(numNbors(agents[j]) < bondLookUp(agents[j].name)){
              console.log("bond order failed on: ");
              console.log(agents[j]);



          }
        }
console.log();
console.log("Starting ---->");
console.log();
//initialize agent space
for (var agentIter = 0; agentIter < agents.length; agentIter++){
  agents[agentIter].x = Math.random()*12;
  agents[agentIter].y = Math.random()*12;
  agents[agentIter].z = Math.random()*12;
}



//takes about 1000 iterations for a an addition reaction to complete
for(var i = 0; i < 10000; i++){
  if(i % 21 ===0 && runlogger){
  //  console.log(i);
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
      agents[j].x = (agents[j].x+ xU1) %12;
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

  intraMolecularReactions();

  //now we need to algin agents in space if any bonding has occured
  //turn of spatial for speed
  if(spatialOn){
  checkSpatialArrangments(1);
  checkSpatialArrangments(2);
  }


}
console.log("DONE");
console.log(agentsToText(agents));
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
        //bonding model
        // its going to want to pull the least electronegatvie nbor because that will be the easiest

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
        closeAgents[indexToGrab].mol = agents[i].mol;

      }
    }


  }
}

function intraMolecularReactions(){
  var mol1 = [];
  var mol2 = [];
  for(var i=0; i < agents.length; i++){
    if(agents[i].mol===1){
      mol1.push(agents[i]);
    }
    else {
      mol2.push(agents[i]);
    }
  }
  //console.log(agentsToText(agents));
  //take the first with low bond order
  var agent = {};
  for(var j = 0; j < mol1.length; j++){
    if(numNbors(agents[j]) < bondLookUp(agents[j].name)){

      agent= nborWithHighestNbors(agents[j]);
      break;
    }
  }
  //onsole.log(agent);
  if(agent && agent.name && agent.name.indexOf("H") === -1){
    var tmp = mostElectronEgativeNBor(agent);

    tmp.mol = 3;
    tmp.nbors = [];
    for(var k2 =0; k2 < agents.length; k2++){
      for(var m3 = 0; m3 < agents[k2].nbors.length; m3++){
        if(agents[k2].nbors[m3]=== tmp.name){
          agents[k2].nbors.splice(m3,1);
        }
      }
    }
  }
  if(agent && agent.nbors ){
    agents[j].nbors.push(agent.name);
    agent.nbors.push(agents[j].name);
  }
}
function mostElectronEgativeNBor(agent){
  var maxEneg = 0;
  var maxEnegAgent = {};
  if(agent.nbors){
  for(var i =0; i < agent.nbors.length; i++){
    for(var j =0; j < agents.length; j++){
      if(agent.nbors[i] ===  agents[j].name){
        if(maxEneg < agents[j].eneg){
          maxEneg = agents[j].eneg;
          maxEnegAgent = agents[j];
        }

      }
    }
  }
  }
  return maxEnegAgent;
}
function leastElectroNegativeOfAgents(agentSet){
  var minEneg = 0;
  var minEnegAgentIndex = 0;
  if(agentSet.length >0){
  for(var i =0; i < agentSet.length; i++){
        if(minEneg > agentSet[i].eneg){
          minEneg = agentSet[i].eneg;
          minEnegAgentIndex = i;
        }

  }
  }
  return minEnegAgentIndex;
}
function nborWithHighestNbors(agent){
  var candidates = agent.nbors;
  var maxNbor = 0;
  var maxNborAgent = {};
  for(var candidatesIter = 0; candidatesIter < candidates.length; candidatesIter++){
    for(var i = 0; i < agents.length; i++){
      if(candidates[candidatesIter] === agents[i].name){
        if(maxNbor < agents[i].nbors.length){
          maxNborAgent = agents[i];
          maxNbor = agents[i].nbors.length;
        }
      }
    }
  }
  return maxNborAgent;
}

function getNearbyAgents(i){
  var nba = [];
  var offest = 12.1 ;
  for(var j = 0; j < agents.length; j++){
      if(agents[i].mol ===1 && agents[j].mol === 2){
        if(Math.abs(agents[i].x-agents[j].x) < offest && Math.abs(agents[i].y-agents[j].y) <offest  && Math.abs(agents[i].z-agents[j].z) <offest){
          //we have two agents from differnect molecules that are sufficeitnly close
          nba.push(agents[j]);
        }
      } else if(agents[i].mol ===2 && agents[j].mol === 1){
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
  if(element.indexOf("O") > -1){
    return 2;
  }
}

function eneg(name){
  for(var i = 0; i < agents.length; i++){
    if(agents[i].name === name){
      return agents[i].eneg;
    }
  }
}

function agentsToText(){
  var mol1 = [];
  var mol1txt = "";
  var mol2 = [];
  var mol2txt = "";
  var mol3txt = "";
  for(var i = 0; i < agents.length; i++){
    if(agents[i].mol === 1 && agents[i].name.indexOf("H") === -1){
      mol1txt+=agents[i].name + " =  " +  agents[i].nbors.toString().replace(/,/g,"-") + "   ";

    } else if(agents[i].mol === 2 && agents[i].name.indexOf("H") === -1){
      mol2txt+=agents[i].name + "  = " + agents[i].nbors.toString().replace(/,/g,"-") + "   ";
    } else if(agents[i].mol === 3 && agents[i].name.indexOf("H") === -1){
      mol3txt+=agents[i].name + "  =  " + agents[i].nbors.toString().replace(/,/g,"-") + "   ";
    }
  }

  return [mol1txt,mol2txt,mol3txt];
}
