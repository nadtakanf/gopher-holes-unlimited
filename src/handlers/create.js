'use strict';
const sqs = require('../helper/sqs')

const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb")
const client = new DynamoDBClient({ region: process.env.REGION })  
const util = require('../helper/util') 

module.exports.queue = async event => {
	try {
        const params = {
            MessageBody: JSON.stringify(event.body),
            QueueUrl: process.env.SOURCE_QUEUE_URL
        }
        const response = await sqs.sendCommand(params);
        return {
            statusCode: 200,
            body: JSON.stringify(response)
        }
    } catch (e) {
        console.log(e)
    }
};

module.exports.process = async event => {
    try {
        const { body } = event.Records[0];
        const params = util.formatItem(JSON.parse(body))
        const command = new PutItemCommand(params);
        await client.send(command); 
    } catch (e) {
        console.log(e)
    }
    
}
