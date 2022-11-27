const express = require("express");
const app = express();

const session = require('express-session');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
  rolling: true,
  cookie: {
    maxAge: 10 * 60 * 1000,
    httpOnly: false,
  },
}));

var bodyParser = require('body-parser');

const {Client_connect} = require('./model/model.js')


app.use("//", async function(request, response){
  if(!request.session.admin){
    response.send(401)
  }
    
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
  if(!request.session.logedin){
    response.send(401)
  }

  if(request.method == "GET"){
    //console.log('hi, im here')

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

app.use("/auth", async function(request, response){
  let username = request.query.username;
  let password = request.query.password;
  let new_con = new Client_connect('users')
  await new_con.GET({'keys': '*', 'where': {'username': username, 'password': password}});
  if(new_con.request.length == 1){
    request.session.logedin = true;
    response.send(true);
  }
  else{
    response.send(false);
  }
})

app.listen(4444) 