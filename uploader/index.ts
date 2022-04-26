let AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-1"
});

let comprehend = new AWS.Comprehend();

import express from 'express';
import { storeTweets } from './utils/twitter';
import { getNumericalData } from './utils/postman';

const app = express();

app.get('/', (req, res) => {
    res.send('Well done!');
})

app.get('/uploadTweets', async (req, res) => {
    await storeTweets("coronavirus")
    res.send('done');
})

app.get('/uploadCovidAPIData', async (req, res) => {
    console.log(getNumericalData('UK', 365));
    console.log(getNumericalData('USA', 365));
    console.log(getNumericalData('India', 365));
    console.log(getNumericalData('Australia', 365));
    console.log(getNumericalData('Canada', 365));
    
    res.send('done');
})

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})