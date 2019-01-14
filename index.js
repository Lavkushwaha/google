'use strict';
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');


var port = process.env.PORT || 3000;

var admin = require("firebase-admin");

var serviceAccount = require("./remote-373-firebase-adminsdk-skkca-1f163444f0.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://remote-373.firebaseio.com"
});

//individual users assigned with it

const key = 'Kw5SCAzDGfg4EC219mhioXDW0zh2';

 
var db = admin.database();  

var express = require('express');
var app = express();


process.env.DEBUG = 'dialogflow:debug';

app.post('/', function(request, response){
  
const agent = new WebhookClient({ request, response });


//   ref.on("value", function(snapshot) {
//   res.send(snapshot.val());
//   console.log(snapshot.val());
  
//   }, function (errorObject) {
//     res.send("The read failed: " + errorObject.code);
//   });


console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
  
  function controls(agent) {

         let params = agent.parameters;
         
         
         var myStatus = null;
         var myDevice = params.device;
         var respText = null;
         var respDevice = null;
         
         
         if(params.status=='0'){
         myStatus=0;
         respText='turned off';
         }
         else if(params.status=='1'){
         myStatus=1;
         respText='Turned on';
         }
         
         
              //database.ref('/'+params.room+'/').set(params.equipment,params.status);
              //agent.add(`${params}`);
                //agent.add(`room ${params.room} should to be ${params.status}`);
                var ref = db.ref(`Kw5SCAzDGfg4EC219mhioXDW0zh2/${params.room}/`);
                
                if(myDevice=='1'){
                ref.update({S1:myStatus});
                
                agent.add(`${params.room}s Fan has been ${respText}`);
                
                }
                if(myDevice=='2'){
                ref.update({S2:myStatus});
                agent.add(`${params.room}s Lamp has been ${respText}`);
                    
                }
                if(myDevice=='3'){
                ref.update({S3:myStatus});
                
                agent.add(`${params.room}s Light has been ${respText}`);
                
                }
                if(myDevice=='4'){
                ref.update({S4:myStatus});
                
                agent.add(`${params.room}s AC has been ${respText}`);
                }
                
 
  }
  
   
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
}

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('controls', controls);
  
  intentMap.set('Default Fallback Intent', fallback);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);

});

app.listen(process.env.PORT || 3000);
