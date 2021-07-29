'use strict';

const util = {}
const tableName = process.env.TABLE_NAME;
const ulid = require('ulid');

util.formatItem = ( gopher => {

    const { name, gopherStatus, gopherType, location } = JSON.parse(gopher);
    const id = ulid.ulid();

    const newName = name.toLowerCase();
    return {
        TableName: tableName,
        Item: {
            PK: { S : `PLAYER#${newName.replace(/\s/g, '')}` },
            SK: { S: `PLAYERID#${id}` },
            id: { S: id },
            name: { S: newName },
            gopherStatus: { S: gopherStatus.toLowerCase() || '' },
            location: { S: location.toLowerCase() || '' },
            gopherType: { S: gopherType.toLowerCase() || '' },
            userStatus: { S: "player" } ,
            createdAt: { S: Date.now().toString() }
        },
        ConditionExpression: "attribute_not_exists(PK)"
    };
    
})

module.exports = util