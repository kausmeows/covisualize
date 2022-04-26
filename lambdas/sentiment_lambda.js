let AWS = require("aws-sdk");

//Configure AWS
AWS.config.update({
  region: "us-east-1",
});

//Create new DocumentClient
let documentClient = new AWS.DynamoDB.DocumentClient();

let comprehend = new AWS.Comprehend();

async function getItem(p) {
  try {
    const data = await documentClient.scan(p).promise();
    return data;
  } catch (err) {
    return err;
  }
}

exports.handler = async (event, context) => {
  const params = {
    TableName: "Twitter",
  };
  try {
    const data = await getItem(params);
    const tweetList = data.Items;

    await tweetList.map((tweet) => {
      let params1 = {
        LanguageCode: "en",
        Text: tweet.text,
      };

      comprehend.detectSentiment(params1, (err, data1) => {
        if (err) {
          console.log(
            "\nError with call to Comprehend:\n" + JSON.stringify(err)
          );
        } else {
          documentClient.update(
            {
              TableName: "Twitter",
              Key: { id: tweet.id },
              UpdateExpression: "set sentiment = :sentiment",
              ExpressionAttributeValues: {
                ":sentiment": data1.Sentiment,
              },
              ReturnValues: "UPDATED_NEW",
            },
            function (err, data1) {
              if (err) console.log(err);
              else console.log(data1.Sentiment);
            }
          );
        }
      });
    });
  } catch (err) {
    return { error: err };
  }
};
