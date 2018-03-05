import AWS = require('aws-sdk');
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import {Quiz} from "./model/quiz";
import {QuizItem, AnswerOption} from "./model/quiz-item"

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

    public write(id: string,name: string, topic: string, questions: any): Promise<any>{
        // console.log("markolsen")
        // var ao1 = new AnswerOption("a", "first option");
        // var ao2 = new AnswerOption("b", "second option");
        // var qi = new QuizItem( "this is the question", [ao1, ao2]);
        // var ao1a = new AnswerOption("aa", "second first option ");
        // var ao2a = new AnswerOption("bb", "second second option");
        // var qia = new QuizItem( "this is the question", [ao1a, ao2a])
        // var q = new Quiz("quiz1", [qi,qia]);
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
           // TableName: process.env.DYNAMODB_TABLE,
            Item: {
              id: topic,
              name: name,
              questions: { questions}
            },
          };

          const putPromiseFn = (params: any):Promise<any> => {
              return new Promise((resolve, reject) =>{
                  this.dynamoDb.put(params, (error, data) => {
                      if (error){
                          reject(error);
                      } else {
                          resolve(data);
                      }
                  })
              })
          }
          return putPromiseFn(params)
    }

    // made the topic eg maths the primary partition key - still called id 
    public getQuizByTopic(id:string): Promise<any>{
    const params = {
    ExpressionAttributeNames: {
        "#id": "id",
    },
    ExpressionAttributeValues: {
        ":id": id,
    },
    KeyConditionExpression: "#id = :id",
    TableName : process.env.DYNAMODB_TABLE
};
const queryPromiseFn = (params: any):Promise<any> => {
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
    return queryPromiseFn(params);
    }
}