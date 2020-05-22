"use strict";

/*

Be sure to follow the instructions in the accompanying README.md file
before you attempt to run this function. Specifically, you must run the 
accompanying AWS CloudFormation template to create a specific set of 
AWS resources that this function depends on.

Sample input payload to this function:

{
  "region": "REGION_ID",
  "message": "You just sent an email by using Amazon SNS.",
  "subject": "Hello from Amazon SNS",
  "topicARN": "arn:aws:sns:REGION_ID:ACCOUNT_ID:TOPIC_NAME"
}

In the preceding payload, replace the following: 

- Replace REGION_ID with the ID of the AWS Region ID where the
  Amazon SNS topic exists.
- Replace ACCOUNT_ID with the AWS account ID that is associated with the 
  existing Amazon SNS topic.
- Replace TOPIC_NAME wih the name of the existing Amazon SNS topic.

*/

exports.handler = (event, context, callback) => {
    if (event["body"]) {
        event = JSON.parse(event["body"]);
    }

    var AWS = require("aws-sdk");
    var region = event["region"];

    AWS.config.update({
        region: region,
    });

    var sns = new AWS.SNS({apiVersion: "2010-03-31"});
    var params = {
        Message: event["message"],
        Subject: event["subject"],
        TopicArn: event["topicARN"],
    };

    sns.publish(params, function(err, data) {
        if (err) {
            callback(null, {
                statusCode: 200,
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({
                    error: {
                        code: err.code,
                        message: err.message,
                    },
                }),
            });
        } else {
            callback(null, {
                statusCode: 200,
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({
                    success: {
                        requestID: data.ResponseMetadata.RequestId,
                        messageID: data.MessageId,
                    },
                }),
            });
        }

        callback(err);
    });
};
