'use strict';
const { DynamoDBClient, DeleteItemCommand } = require("@aws-sdk/client-dynamodb")
const client = new DynamoDBClient({ region: process.env.REGION })  
const util = require('../helper/util')
const sns = require('../helper/sns')

module.exports.handler = async event => { 
    try {
        const idObject = util.matchPathElements(event.detail.path, '/delete/{id}')

        const { claims } = event.detail.requestContext.authorizer;
        
        const params = {
            Key: {
                PK: {
                    S: `USER#${claims['cognito:username']}`
                },
                SK: {
                    S: `ITEM#${idObject.id}`
                }
            }, 
            TableName: process.env.TABLE_NAME
        }
    
        const command = new DeleteItemCommand(params)
        await client.send(command)
    } catch (err) {
        await sns.notifyFailure(err);
    }
};
