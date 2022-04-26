const AWS = require('aws-sdk');

//Configure AWS
AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

const documentClient = new AWS.DynamoDB.DocumentClient();

async function getItem(p){
  try {
    const data = await documentClient.scan(p).promise()
    return data
  } catch (err) {
    return err
  }
}

exports.handler = async (event, context) => {
   let t = event.queryStringParameters.table_name;
   const params = {
  TableName : t
  }
  try {
    const data = await getItem(params)
    return { body: JSON.stringify(data) }
  } catch (err) {
    return { error: err }
  }
}

// endpoint -  https://aam05onrm7.execute-api.us-east-1.amazonaws.com/default/covLamb?table_name=<Name of table>