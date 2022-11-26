const { Pool } = require('pg')
const { password } = require('./config.js')
const client = new Pool({
  user: 'scv',
  host: 'localhost',
  database: 'hac',
  password: password,
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

  async SPECIAL(jsn){
    let textRequest = `SELECT nt.*
    FROM "unusualShit" nt
    INNER JOIN (
        SELECT daytime, MAX(author) AS author
        FROM "unusualShit"
        WHERE (author = ${jsn[0]} OR author = ${jsn[1]} OR author = ${jsn[2]}) AND daytime >= '${jsn[3]}' AND daytime <= '${jsn[4]}'
        GROUP BY daytime
    ) nt2 ON nt.daytime = nt2.daytime AND nt.author = nt2.author`; 
    console.log(textRequest);
    let request_promis = client.query(textRequest);
    this.result = await request_promis;
    console.log(this.result.rows)
    return this.result.rows;


    //console.log(this.request)
  }
}

module.exports = {Client_connect}