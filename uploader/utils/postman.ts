let AWS = require("aws-sdk");
var axios = require('axios');
import { v4 as uuidv4 } from 'uuid';

//Configure AWS
AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});


//Create new DocumentClient
let documentClient = new AWS.DynamoDB.DocumentClient();

export async function getNumericalData(country:String,days:Number){
var config = {
  method: 'get',
  url: 'https://disease.sh/v3/covid-19/historical/'+country+'?lastdays='+days,
  headers: { }
};

axios(config).then((res: any) => {

  Object.entries(res.data.timeline.cases).forEach(
    ([key, value]) => {
      let params = {
        TableName: "Cases",
        Item: {
            date: key,
            cases: value, 
            country: country,
            UUID: uuidv4(),
        }
      };
    documentClient.put(params, (err:any, data:any) => {
      if (err) {
          console.error("Unable to add item: " +  JSON.stringify(err));
      }
      else {
          console.error("Item added to table with id: " + key);
      }
  })

  }
);
});

axios(config).then((res: any) => {

  Object.entries(res.data.timeline.deaths).forEach(
    ([key, value]) => {
      let params = {
        TableName: "Deaths",
        Item: {
            date: key,
            deaths: value, 
            country: country,
            UUID: uuidv4(),
        }
      };
    documentClient.put(params, (err:any, data:any) => {
      if (err) {
          console.error("Unable to add item: " +  JSON.stringify(err));
      }
      else {
          console.error("Item added to table with id: " + key);
      }
  })

  }
);

});

};


