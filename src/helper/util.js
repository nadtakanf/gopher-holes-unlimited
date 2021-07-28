'use strict';

const util = {}
const tableName = process.env.TABLE_NAME;
const ulid = require('ulid');

util.formatItem = ( gopher => {
    const id = ulid.ulid();
    let name = gopher.name.toLowerCase();
    return {
        TableName: tableName,
        Item: {
            PK: { S : `PLAYER#${name.replace(/\s/g, '')}` },
            SK: { S: `PLAYERID#${id}` },
            id: { S: id },
            name: { S: name },
            gopherStatus: { S: gopher.gopherStatus.toLowerCase() },
            location: { S: gopher.location.toLowerCase() },
            gopherType: { S: gopher.gopherType.toLowerCase() },
            userStatus: { S: "player" } ,
            createdAt: { S: Date.now().toString() }
        },
        ConditionExpression: "attribute_not_exists(PK)"
    };
    
})

module.exports = util