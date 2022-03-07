'use strict';

var path = require('path');
var http = require('http');
var https = require('https');
var oas3Tools = require('oas3-tools');
var serverPort = 443;
const fs = require('fs');

//var jwt = require('jsonwebtoken');

function verifyToken (req, authOrSecDef, scopesOrApiKey, next) {

console.log(req.query['X-API-KEY']);
      // your security code
      if ('1234' === req.query['X-API-KEY']) {
         return true;
        //next(true);
      } else {
       // next(new Error('access denied!'));
       return false;
      }
    }
    
function verifyToken1(req, secDef, token, next) {
  console.log(token);
  console.log("val: "+ req.query['X-API-KEY']);
  if (req.query['X-API-KEY']){
  
	console.log("present");
	return;	
  } else {
  console.log("Missing ");
   // return next(req.res.sendStatus(403));
  }
  
}


// Require this module for mongodb interaction
const mongoose = require('mongoose')


// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
    openApiValidator: {
        validateSecurity: {
            handlers: {
                bearerAuth: verifyToken,
            }
        }
    }, 
};

// Connect to DB
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/directory', {useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err)
     console.error(err);
  else
     console.log("Connected to the mongodb"); 
});

// Certificate
const privateKey = fs.readFileSync('privkey.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
//const ca = fs.readFileSync('chain.pem', 'utf8');

const credentials = {
        key: privateKey,
        cert: certificate,
      //  ca: ca
}


var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var app = expressAppConfig.getApp();


// Initialize the Swagger middleware
http.createServer(credentials, app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
/*    
//Redirect http to https
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);
*/
});

