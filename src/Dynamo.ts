import AWS = require('aws-sdk');
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import {Quiz} from './model/quiz'
import {Question} from './model/quiz-item'

export interface IHttpResponseCodes{
    code: number;
    response: string;
}
export class Dynamo{
    public constructor(){
        AWS.config.update({region: "us-east-1"});
        this.dynamoDb = new AWS.DynamoDB.DocumentClient();
    }

    private dynamoDb: DocumentClient;

    public write(quiz: Quiz, questions: Question[]): Promise<any>{
        console.log("markolsen" + quiz)
        //for writing a line to the quiz table
        const quizParams = {
            TableName: process.env.DYNAMODB_QUIZ_TABLE,
           // TableName: process.env.DYNAMODB_TABLE,
            Item: {
              topic: quiz.topic + '-' + quiz.level,
              name: quiz.quizName,
              numberOfQuestions: questions.length,
            },
          };
          // for creating a promise that when this resolves the write to dynamo is done
          // can pass in params for either quiz or questions
          let putPromiseFn = (params: any):Promise<any> => {
            return new Promise((resolve, reject) =>{
                this.dynamoDb.put(params, (error, data) => {
                    if (error){
                        console.log("error" +error)
                        reject(error);
                    } else {
                        resolve(data);
                    }
                })
            })
        }

        // array to store promises which will write to the questions table as many times as 
        // there are questions input
        const questionPromiseArray: Promise<any>[] = [];

        //function that fills up the questionPromiseArray with the passed in questions
        questions.forEach((elem, index) =>{
        const questionsParams = {
            TableName: process.env.DYNAMODB_QUESTION_TABLE,
                Item: {
                quizName: quiz.topic +'-'+ quiz.level +'-' +quiz.quizName,
                questionNo: index,
                question: elem.question,
                answer: elem.answer,
                options: elem.options,
                },
            };
            questionPromiseArray.push(putPromiseFn(questionsParams));
        })
        return putPromiseFn(quizParams)
        .then(()=>{
        return Promise.all(questionPromiseArray)
        }).catch(err=>{
            console.log(err);
        })
    }
    private queryPromiseFn = (params: any):Promise<any> => {
        return new Promise((resolve, reject) =>{
            this.dynamoDb.query(params, (error, data) => {
                if (error){
                    reject(error);
                } else {
                    resolve(data);
                }
            })
        })
    }

    // made the topic eg maths the primary partition key - still called id 
    public getQuizByTopic(topic: string): Promise<any>{
        const params = {
        ExpressionAttributeNames: {
            "#topic": "topic",
        },
        ExpressionAttributeValues: {
            ":topic": topic,
        },
        KeyConditionExpression: "#topic = :topic",
        TableName : process.env.DYNAMODB_QUIZ_TABLE
    };


        return this.queryPromiseFn(params);
    }

    public getAnswerOptions(quizName: string, questionNo: number): Promise<any> {
            //bpid-> quizname cachetype=questionno
            const params = {
                ExpressionAttributeNames: {
                  "#quizName": "quizName",
                  "#questionNo": "questionNo",
                },
                ExpressionAttributeValues: {
                  ":quizName": quizName,
                  ":questionNo": questionNo,
                },
                KeyConditionExpression: "#quizName = :quizName and #questionNo = :questionNo",
                TableName: process.env.DYNAMODB_QUESTION_TABLE,
              };

            return this.queryPromiseFn(params)
    }
}