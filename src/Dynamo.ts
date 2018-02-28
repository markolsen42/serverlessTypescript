import AWS = require('aws-sdk');
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";

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

    public write(id: string, text: string): Promise<any>{
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
           // TableName: process.env.DYNAMODB_TABLE,
            Item: {
              id: id,
              text: { name: text, date: new Date()}
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
}