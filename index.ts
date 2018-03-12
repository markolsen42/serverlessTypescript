import {Request, Response, NextFunction} from 'express';
import {Hello} from './src/Hello';
import {Config} from './src/Config';
import {Dynamo} from './src/Dynamo';


const uuid = require('uuid');
const serverless = require('serverless-http');
const express = require('express');
// Allow reading of body on POST with req.body
var bodyParser = require('body-parser');


const app = express()

/****************************************
MIDDLEWARE 
*****************************************/

let dynamo = new Dynamo();

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

app.get('/', function (req: Request, res: Response) {
  let hello = new Hello('World');
  res.send(hello.greet())
});

app.get('/goodbye', (req: Request, res: Response) => {
  let goodbye = new Hello('Goodbye');
  res.send(goodbye.greet());
});

app.get('/config', (req: Request, res: Response) => {
  let config = new Config();
  res.send(config.values);
});

app.post("/addQuiz", (req: Request, res: Response) => {
  dynamo.write( req.body.quiz, req.body.questions).then((result: any) => {
    res.status(200).send(JSON.stringify(result));
  }).catch((error) => {
    res.status(error.statusCode).send(JSON.stringify(error))
  });
})

app.get("/getQuizByTopic/:topic", (req: Request, res: Response) => {
  
  dynamo.getQuizByTopic(req.params.topic).then((result: any) => {
    res.status(200);
    res.send(JSON.stringify(result.Items));
  }).catch((error) => {
    res.status(500);
    res.send(JSON.stringify(error))
  });
})

app.get("/getAnswerOptions/:quizName/:questionNo", (req: Request, res: Response) => {
    dynamo.getAnswerOptions(req.params.quizName, req.params.questionNo)
    .then((result: any) => {
      res.status(200);
      res.send(JSON.stringify(result.Items));
    }).catch((error) => {
      res.status(500);
      res.send(JSON.stringify(error))
    });
})



module.exports.handler = serverless(app);

