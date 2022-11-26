const express = require("express");
const app = express();

const session = require('express-session');
var bodyParser = require('body-parser');

const {Client_connect} = require('./model.js')


app.use("//", async function(request, response){
    
  if(request.method == "POST" || request.method == "PUT"){ 
    let new_con = new Client_connect(request.body.table)
    await new_con.PUST(request.body.items)
    response.send('ok.')
  }
  if(request.method == "GET"){
    let new_con = new Client_connect(request.query.table)
    await new_con.GET({'keys': request.query.keys, 'where': {}}) 
    response.send(new_con.request)
  }
  if(request.method == "DELETE"){
    let new_con = new Client_connect(request.query.table)
    await new_con.DELETE({'id': request.query.id})
    response.send('ok.')
  }
  
})

app.use("/getweek", async function(request, response){

  if(request.method == "GET"){
    console.log('hi, im here')

    try{  
      let new_con = new Client_connect('unusualShit');
      let sendThis = await new_con.SPECIAL([request.query.id, 
          (parseInt(request.query.id / 100) * 100).toString(), 
          (parseInt(request.query.id / 1000) * 1000).toString(), 
          request.query.start, request.query.end]);
      console.log(sendThis)
      response.send(sendThis);

    }
    catch(err){
      response.send(err);
      throw(err);
    }
   }
  else{
    let new_con = new Client_connect("unusualShit")
    await new_con.PUST(request.body)
    response.send(202)
  }
  
})

app.listen(4444) 