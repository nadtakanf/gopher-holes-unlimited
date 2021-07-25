'use strict';
const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const ddbClient = new DynamoDBClient({ region: process.env.REGION });
const util = require('../helper/util');
const sns = require('../helper/sns');

module.exports.handler = async event => {
    try {
        const body = JSON.parse(event.detail.body);
        const idObject = util.matchPathElements(event.detail.path, '/update/{id}')

        const { claims } = event.detail.requestContext.authorizer;

        const params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                PK: { S: `USER#${claims['cognito:username']}` },
                SK: { S: `ITEM#${idObject.id}` }
            },
            UpdateExpression: "SET title = :title, description = :description, itemStatus = :itemStatus, dueDate = :dueDate",
            ExpressionAttributeValues: {
                ":title": { S: body.title },
                ":description": { S: body.description },
                ":itemStatus": { S: body.itemStatus.toLowerCase() },
                ":dueDate": { S: body.dueDate }
            },
            ReturnValues: "UPDATED_NEW",
            ConditionExpression: "attribute_exists(PK)"
        };
        const command = new UpdateItemCommand(params);
        await ddbClient.send(command);
    } catch (err) {
        await sns.notifyFailure(err);
    }
    
};
