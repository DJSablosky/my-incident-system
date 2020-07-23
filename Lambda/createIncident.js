'use strict';

const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const data = JSON.parse(event.body);

  const params = {
    TableName: 'Incidents',
    Item: {
      IncidentTitle: data.IncidentTitle,
      IncidentDate: data.IncidentDate,
      IncidentDescription: data.IncidentDescription,
      IncidentStatus: data.IncidentStatus,
      IncidentType: data.IncidentType
    },
  };

  // write the item to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {'Access-Control-Allow-Origin': '*'},
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
}