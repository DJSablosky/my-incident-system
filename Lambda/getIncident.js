'use strict';

const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
  const data = event.queryStringParameters;

  const params = {
    TableName: 'Incidents',
    Key: {
      "IncidentTitle": data.IncidentTitle,
      "IncidentDate": data.IncidentDate
    },
  }
  
  // fetch item from DynamoDB
  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {'Access-Control-Allow-Origin': '*'},
      body: JSON.stringify(result),
    };
    callback(null, response);
  });
}