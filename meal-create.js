"use strict";
import * as AWS from "aws-sdk";

AWS.config.setPromisesDependency(require("bluebird"));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.addMeal = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  // const mealName = requestBody.mealName;
  // const ingredients = requestBody.ingredients;
  const {mealName, ingredients} = requestBody;

  submitMeal(mealInfo(mealName, ingredients))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted meal with name ${mealName}`,
      })
    });
  })
  .catch(err =>  {
    console.log(err);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        message: `Unable to submit meal with name ${mealName}`
      })
    })
  });
}

const submitMeal = (meal) => {
  console.log("Submitting meal");
  const mealInfo = {
    TableName: process.env.MEAL_TABLE,
    Item: meal,
  };
  return dynamoDb
    .put(mealInfo)
    .promise()
    .then((res) => meal);
};

const mealInfo = (mealName, ingredients) => {
  const timestamp = new Date().getTime();
  return {
    mealName,
    ingredients,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};

// module.exports.addMeal = async (event) => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify(
//       {
//         message: "This will be our add meal function - Emmas addition ",
//         input: event,
//       },
//       null,
//       2
//     ),
//   };

//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };
