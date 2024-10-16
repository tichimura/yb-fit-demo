var express = require('express');
var rateLimit = require('express-rate-limit');
var app = express();
var fs = require('fs');
var path = require('path');
var util = require('util');
var execFile = require('child_process').execFile;
var exec = require('child_process').exec;
var PORT = 4444;
var local_connection_limit = 10;

const pg2 = require('pg');
const pg = require('@yugabytedb/pg');
const async = require('async');
const { callbackify } = require('util');
const { rows } = require('pg/lib/defaults');
const dotenv = require('dotenv');
const { error } = require('console');
const { execSync } = require('child_process');
const e = require('express');
const { randomUUID, randomFill } = require('crypto');

if(!process.env.DBHOST){
  dotenv.config({ path: '.env.local' });
}

const limiter = rateLimit({
	windowMs: 1000, //
	max: 5 // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});


// change to var from const
var config = {
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  database: process.env.DATABASE,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  loadBalance: true,
  statement_timeout: 1800,
  ybServersRefreshInterval: 10,
  connectionTimeoutMillis: 1000
};

var client;

app.use('/assets', express.static('assets')); 

app.route('/map')
 .all(function(req, res) {
   res.sendFile(path.join(__dirname, 'index.html'));
 });


app.route('/load')
.get(async function(req,res,callbackHadler){

  try{

    const start = new Date().getTime();
    const promises = [];
    
    const client = new pg2.Client(config);
    client.connect();

    var values;

    // await client.query('SELECT amount FROM ' + req.query.cloud + ' where user_id = 100').then(results => {
    await client.query("SELECT count(account_id) FROM " + req.query.cloud + " where created_at > CURRENT_TIMESTAMP - INTERVAL \'60 MINUTES\'").then(results => {

      if(results.rowCount == 0 ){
        values = '0';
      }else{
        // values = results.rows[0].amount.toString();
        values = results.rows[0].count;
      }
      })
      .catch((err) => {
        console.log(err + '/load エンドポイントで'+ req.query.cloud + 'でのconnection countの query error が発生しました。' + err.stack);
    });
    client.end();
    
    Promise.all(promises).then(() => {
      const end = new Date().getTime()
      console.log((end - start) / 1000);
    });


    return res.status(200).send(values);

  }catch(e){
      console.log(e + ': エラーが発生しました');
      return res.status(500).send('エラーが発生しました: '+e);
  }
  
});

app.route('/update')
.post(async function(req,res,callbackHadler){

  try{

    const start = new Date().getTime();
    const promises = [];
    
    const client = new pg.Client(config); 
    client.connect();
    console.log(req.query.cloud + ' is cloud ');
    console.log(req.query.value + ' is updated ');

    await client.query('update ' + req.query.cloud + ' SET value = ' + req.query.value + ' where id = 1' ).then(results => {
      console.log(results);
      })
      .catch((err) => {
        console.log(err + '/update エンドポイントで updateの query error が発生しました。' + err.stack);
    });
    client.end();
    
    Promise.all(promises).then(() => {
      const end = new Date().getTime()
      console.log((end - start) / 1000);
    });
  
    return res.status(200).send('updated');

  }catch(e){
      console.log(e + ': updateエンドポイントでエラーが発生しました');
      return res.status(500).send('updateエンドポイントでエラーが発生しました: '+e);
  }
  
});


app.listen(PORT, function() {
    console.log("app will listen on port 4444");
});
