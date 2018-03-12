import {Request, Response, NextFunction} from 'express';
import {Hello} from './src/Hello';
import {Config} from './src/Config';
import {Dynamo} from './src/Dynamo';
import {Quiz} from './src/model/quiz'
import { Question, AnswerOption, AnswerOptions } from './src/model/quiz-item';
import {Promise} from 'bluebird';

const uuid = require('uuid');
const serverless = require('serverless-http');
const express = require('express');
// Allow reading of body on POST with req.body
var bodyParser = require('body-parser');


const app = express()

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
  var id = uuid.v1();
  let dynamo = new Dynamo();
  //let quiz = new Quiz("maths", 1, "firstMathsQuiz", 3);
  // const answerOptions = new AnswerOptions();
  // answerOptions.add(new AnswerOption('a', "1" ));
  // answerOptions.add(new AnswerOption('b', "2" ));
  // answerOptions.add(new AnswerOption('c', "3" ));
  // answerOptions.add(new AnswerOption('d', "4" ));


  // let question = new Question("maths-firstMathsQuiz", 1,"What is 1+1?", answerOptions, 'b');
 //console.log(JSON.stringify(question))
 console.log(JSON.stringify(req.body));
  dynamo.write( req.body.quiz, []).then((result: any) => {
    res.status(200);
    res.send(JSON.stringify(result));
  }).catch((error) => {
    res.status(error.statusCode);
    res.send(JSON.stringify(error))
  });
})

app.get("/getQuizByTopic/:topic", (req: Request, res: Response) => {
  let dynamo = new Dynamo();
  dynamo.getQuizByTopic(req.params.topic).then((result: any) => {
    res.status(200);
    res.send(JSON.stringify(result.Items));
  }).catch((error) => {
    res.status(500);
    res.send(JSON.stringify(error))
  });
})

module.exports.handler = serverless(app);

