import {Request, Response} from 'express';
import {Hello} from './src/Hello';
const serverless = require('serverless-http');
const express = require('express')

const app = express()

app.get('/', function (req: Request, res: Response) {
  let hello = new Hello('World');
  res.send(hello.greet())
})

module.exports.handler = serverless(app);

