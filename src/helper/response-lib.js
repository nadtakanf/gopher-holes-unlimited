'use strict';
const response = {}

response.success = ((body) => {
	return response.buildResponse(200, body)
})

response.failure = ((body) => {
	return response.buildResponse(500, body)
})

response.buildResponse = ((statusCode, body) => {
	return {
		statusCode: statusCode,
		headers: {
			"Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
		},
		body: body
	}
})

module.exports = response