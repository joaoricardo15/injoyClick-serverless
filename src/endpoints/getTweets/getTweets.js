'use strict';

var axios = require("axios");

module.exports.handler = async (event, context, callback) => {

  const params = event.queryStringParameters;

  const twitterApiUrl = "https://api.twitter.com/1.1/";
  const twitterApiToken =
    "AAAAAAAAAAAAAAAAAAAAAFmCDQEAAAAApOMjYh%2BtAI6UF2UEUg8w4SIjghY%3DT5u51URhC7zQws7L1IOR2u5wzJ5c3rYb63rqEkavUF5ioxnFHl";
  const twitterHeaders = {
    Authorization: `Bearer ${twitterApiToken}`
  };

  const response = await axios.request({
    url: "search/tweets.json",
    baseURL: twitterApiUrl,
    headers: twitterHeaders,
    params: {
      result_type: "popular",
      count: 20,
      lang: "pt",
      ...params
    }
  })

  return callback(null, {
    statusCode: response.status,
    headers: { 
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(response.status === 200 ? response.data.statuses : response)
  });
};
