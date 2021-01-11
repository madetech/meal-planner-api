"use strict";

const AWS = require("aws-sdk");

AWS.config.setPromisesDependency(require("bluebird"));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.readMeals = (event, context, callback) => {
  var params = {
    TableName: process.env.MEAL_TABLE,
    ProjectionExpression: "mealName, ingredients",
  };
  console.log("Scanning meal table");

  const onScan = (err, data) => {
    if (err) {
      console.log(
        "Scan failed to load data. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      callback(err);
    } else {
      console.log("Scan succeeded.");
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          meals: data.Items,
        }),
      });
    }
  };

  dynamoDb.scan(params, onScan);
};
