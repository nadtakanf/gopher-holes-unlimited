'use strict'
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs")
const client = new SQSClient({ region: process.env.REGION })  

module.exports.sendCommand = async (params) => {
  try {
    const command = new SendMessageCommand(params)
    return await client.send(command)
  } catch (e) {
    console.error(e);
  }
};
