import {Request, Response} from 'express';
import {Hello} from './src/Hello';
import {Config} from './src/Config';
import {Dynamo} from './src/Dynamo'
import AWS = require('aws-sdk');
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
const serverless = require('serverless-http');
const express = require('express');

AWS.config.update({region: "us-east-1"});
const dynamoDb: DocumentClient = new AWS.DynamoDB.DocumentClient();



const app = express()

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

app.get("/write/:id/:text", (req: Request, res: Response) => {
  console.log(req.params.id);
  console.log(req.params.text);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
   // TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: req.params.id,
      text: { name: req.params.text, date: new Date()}
    },
  };
  let dynamo = new Dynamo();
  dynamo.write(req.params.id, req.params.text).then((result: any) => {
    res.status(200);
    res.send(JSON.stringify(result));
  }).catch((error) => {
    res.status(500);
    res.send(JSON.stringify(error))
  });
})

module.exports.handler = serverless(app);

