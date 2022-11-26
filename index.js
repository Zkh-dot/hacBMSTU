const express = require("express");
const app = express();

const session = require('express-session');
var bodyParser = require('body-parser');

const { Pool } = require('pg')
const client = new Pool({
  user: 'scv',
  host: 'localhost',
  database: 'hac',
  password: 'xNuwkN2N67Kieu8XrNKo',
  port: 5432,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
})
client.connect()


class Client_connect{ 
  constructor(tablename){
      this.tablename = tablename
  }

  async GET(jsn, start = false, end = false){ 
      console.log('->', jsn)
      jsn.keys = jsn.keys.toString();

      let where_search_str = ''
      if(Object.keys(jsn.where).length != 0)
          where_search_str = ' WHERE '
          for(let i of Object.keys(jsn.where)){
              where_search_str += i.toString() + "='" + jsn.where[i] + "',";
          }
          where_search_str = where_search_str.slice(0, -1);
      
      let request_promis;
      if(start && end){
          let textRequest = `SELECT ${jsn.keys} FROM "${this.tablename}" WHERE daytime>='${start}' and daytime<='${end}' and author='${jsn.author}'`;
          request_promis = client.query(textRequest)
          console.log(textRequest)
        }
      else{  
        request_promis = client.query(`SELECT ${jsn.keys} FROM ${this.tablename}${where_search_str}`)
        console.log(`SELECT ${jsn.keys} FROM ${this.tablename}${where_search_str}`) 
      }
      let request = await request_promis;
      this.request = request.rows;
  }

  async PUST(jsn){
      if(jsn.id){
          let set = '';
          for(let i of Object.keys(jsn)){
              if(jsn[i] != null)
                  set += i.toString() + " = '" + jsn[i].toString() + "', ";
              else
                  set += i.toString() + ' = null, ';
          }
          let request_promis = client.query(`UPDATE ${this.tablename} SET ${set.slice(0, -2)} WHERE id = ${jsn.id}`);
          console.log(`UPDATE ${this.tablename} SET ${set.slice(0, -2)} WHERE id = ${jsn.id}`);
          let request = await request_promis;
          this.request = request;
      }
      else{
          let keys = [];
          let values = [];
          for(let i of Object.keys(jsn)){
              keys.push(i);
              if(jsn[i] != null)
                  values.push("'" + jsn[i].toString() + "'");
              else
                  values.push("'" + null + "'");
          }
          keys = keys.toString();
          values = values.toString();
          let request_promis = client.query(`INSERT INTO ${this.tablename} (${keys}) VALUES (${values})`);
          let request = await request_promis;
          console.log(`INSERT INTO ${this.tablename} (${keys}) VALUES (${values})`);
          console.log(request) 
          this.request = request;
      }
  }
  
  async DELETE(jsn){
      let where = ''
      for(let i of Object.keys(jsn)){
          if(jsn[i] != null)
              where += i.toString() + " = '" + jsn[i].toString() + "', ";
          else
              where += i.toString() + ' = null, ';
      }
      let request_promis = client.query(`DELETE FROM ${this.tablename} WHERE ${where.slice(0, -2)}`)
      this.request = await request_promis;
  }
}


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
      await new_con.GET({'keys': request.query.keys, 'where': {}, 'author': request.query.id}, 
        request.query.start, 
        request.query.end);

      await new_con.GET({'keys': request.query.keys, 'where': {}, 'author': (parseInt(request.query.id / 100) * 100).toString()}, 
        request.query.start, 
        request.query.end);

      let group = new_con.request;

      await new_con.GET({'keys': request.query.keys, 'where': {}, 'author': (parseInt(request.query.id / 1000) * 1000).toString()}, 
        request.query.start, 
        request.query.end);

      let pot = new_con.request;

      let sumSend = personal.concat(group).concat(pot)
      console.log(personal, group, pot);
      response.send(sumSend);
    }
    catch(err){
      response.send(err);
    }
   }
  else{
    let new_con = new Client_connect("unusualShit")
    await new_con.PUST(request.body)
    response.send(202)
  }
  
})

app.listen(4444) 