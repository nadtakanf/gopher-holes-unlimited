'use strict';
const log = require('lambda-log');
const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb")
const client = new DynamoDBClient({ region: process.env.REGION })  
const sns = require('../helper/sns')
const util = require('../helper/util')

module.exports.handler = async event => {
    try {
        const { claims } = event.detail.requestContext.authorizer;
        const { itemStatus } = event.detail.multiValueQueryStringParameters;
        
        const params = {
            TableName: process.env.TABLE_NAME,
            IndexName: 'itemStatusGSI',
            KeyConditionExpression: "itemStatus = :itemStatus and PK = :pk", 
            ExpressionAttributeValues: {
                ":itemStatus": { S: itemStatus[0] },
                ":pk": { S: `USER#${claims['cognito:username']}` }
            }
        } 
    
        const command = new QueryCommand(params)
        const response = await client.send(command);
        console.log(response)
        return response.$metadata.Items
    } catch (err) {
        await sns.notifyFailure(err);
    }
};
