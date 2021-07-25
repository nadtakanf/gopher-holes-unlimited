'use strict'
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb")
const client = new DynamoDBClient({ region: process.env.REGION })  
const sns = require('../helper/sns');
const util = require('../helper/util')

module.exports.handler = async (event) => {
    try{
        const params = util.formatUser(event)
        const command = new PutItemCommand(params);
        await client.send(command); 
    } catch (err) {
        await sns.notifyFailure(err);
    }
        
    return event
}