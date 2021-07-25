'use strict';

const util = {}
const tableName = process.env.TABLE_NAME;
const ulid = require('ulid');
/**
 * Returns task format object
 * @param {Object} task task to reformat
 * @return {Object} item object
 */
util.formatItem = ((task, claims) => {
    const itemId = ulid.ulid();
    return {
        TableName: tableName,
        Item: {
            PK: { S : `USER#${claims['cognito:username']}` },
            SK: { S: `ITEM#${itemId}` },
            id: { S: itemId },
            title: { S: task.title },
            description: { S: task.description },
            itemStatus: { S: task.itemStatus.toLowerCase() },
            dueDate: { S: task.dueDate },
            user: { S: claims['cognito:username'] } ,// TODO: replace this with cognito user email
            email: { S: claims['email'] },
            createdAt: { S: Date.now().toString() }
        },
        ConditionExpression: "attribute_not_exists(PK)"
    };
    
})

/**
 * Returns a list of matches of the given pattern
 * @param {String} string string to match
 * @param {String} pattern pattern
 * @param {String} maches 
 */
function getMatches(string, pattern) {
    const regex = new RegExp(pattern, 'g');
    const matches = [];
    let match;
    while ((match = regex.exec(string))) {
      matches.push(match[1]);
    }
    return matches;
}

/**
   * Attempts to match path elements and return it as
   * an object where the key is the token name and the
   * value is the matched value
   * @param {String} path path
   * @param {String} pathPattern path pattern
   * @return {String} match path elements
*/
util.matchPathElements = (path, pathPattern) => {
    // find all match tokens
    const tokens = getMatches(pathPattern, '{([^}]+)}');

    // convert {token}s into (.*) to create a regex pattern
    const pattern = pathPattern.replace(/{[^}]+}/g, '(.*)');

    // try to match against the pattern
    const match = path.match(new RegExp(pattern));
    
    if (!match) {
      return null;
    }

    if (tokens.length !== match.length - 1) {
      throw new BadRequestError('Match count different from token count');
    }

    const result = {};
    for (let i = 1; i < match.length; i += 1) {
      result[tokens[i - 1]] = match[i];
    }
    return result;
}

module.exports = util