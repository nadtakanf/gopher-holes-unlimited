const { EventBridgeClient, PutEventsCommand } = require("@aws-sdk/client-eventbridge");
const client = new EventBridgeClient({ region: process.env.REGION });
const util = require('../helper/util');

module.exports = {
    sendToEventBridge : async (bridgeName, event) => {
        const { path, httpMethod } = event;

        // set default to api/create
        let detailType = 'create'; 

        // replace this with includes and array
        if (httpMethod === 'PUT' && util.matchPathElements(path, '/update/{id}')) {
            detailType = 'update'
        } else if (httpMethod === 'DELETE' && util.matchPathElements(path, '/delete/{id}')) {
            detailType = 'delete'
        } else if (httpMethod === 'GET' && path === '/search') {
            // detailType = 'search'
            // making a call to sqs -> lambda to query data and return back to the user
        }

        const params = {
        Entries: [
            {
                Detail: JSON.stringify(event),
                DetailType: detailType,
                EventBusName: process.env.EVENT_BRIDGE,
                Source: 'source.events',
                Time: new Date()
            }
        ]
        };
        
        const command = new PutEventsCommand(params);
        return await client.send(command);
    }
};
