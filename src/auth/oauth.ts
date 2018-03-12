import {Request, Response, NextFunction} from 'express';
import {Hello} from '../../src/Hello';
const oauth2orize = require('oauth2orize')
const serverless = require('serverless-http');
const express = require('express');
// Allow reading of body on POST with req.body
var bodyParser = require('body-parser');


const app = express()
var server = oauth2orize.createServer();
/****************************************
MIDDLEWARE 
*****************************************/


// CORS Enablement
app.use(function(req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


/****************************************
ROUTES 
*****************************************/

app.get('/oauth', function (req: Request, res: Response) {
  let hello = new Hello('OAUTH');
  res.send(hello.greet())
});

module.exports.handler = serverless(app);

