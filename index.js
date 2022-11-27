const express = require("express");
const app = express();
const path = require('path');

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

const jwt = require('jsonwebtoken')

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

const { Client_connect } = require('./model/model.js')
const { AuthService } = require('./auth/auth.js')

async function tokenDiller(login, password){
  let auth = new AuthService()
  let response;
  //auth.SignUp('user', 'password', 1, 1, 1)
  try{
      response = await auth.Login(login, password)
  }
  catch(e){
      response = false
  }
  return response;
}


app.use("//", async function(request, response){
  let token = jwt.verify(request.header.token, request.header.secret);
  if(!token){
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
  let token;
  console.log(request.query.token)
  try{
    token = jwt.verify(request.query.token, 'secret');
  }
  catch(e){
    response.send(401)
  }
  if(!token){
    response.send(401)
  }

  if(request.method == "GET"){
    //console.log('hi, im here')

    try{  
      let new_con = new Client_connect('unusualShit');
      let sendThis = await new_con.SPECIAL([request.session.userid, 
          (parseInt(request.session.userid / 100) * 100).toString(), 
          (parseInt(request.session.userid / 1000) * 1000).toString(), 
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

app.use("/createevent", async function(request, response){
  let token;
  console.log(request.query.token)
  try{
    token = jwt.verify(request.query.token, 'secret');
  }
  catch(e){
    response.send(401)
  }
  if(!token){
    response.send(401)
  }
  console.log(request.body)
  let new_con = new Client_connect("unusualShit");
  request.body.author = request.session.userid;
  await new_con.PUST(request.body)
  response.send(true);
})

app.use("/auth", async function(request, response){
  let username = request.query.username;
  let password = request.query.password;
  let token = await tokenDiller(username, password)
  request.session.userid = token[1];
  response.send(token[0])
})

app.use("/reg", async function(request, response){
  let username = request.query.username;
  let password = request.query.password;
  let course = request.query.course;
  let group = request.query.group;
  let userid = request.query.userid;
  let registerConect = new AuthService();
  response.send(registerConect.SignUp(username, password, course, group, userid))
})
app.use("/front", async function(request, response){
  if(request.session.username){
    response.send('ok')
  }
  else{
    response.sendFile(path.join(__dirname + '/views/login.html'));
  }
}) 

app.listen(4444) 