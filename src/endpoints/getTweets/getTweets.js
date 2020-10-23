'use strict';

var axios = require("axios");

module.exports.handler = async event => {
  return new Promise((resolve, reject) => {
    const twitterApiUrl = "https://api.twitter.com/1.1/";
    const twitterApiToken =
      "AAAAAAAAAAAAAAAAAAAAAFmCDQEAAAAApOMjYh%2BtAI6UF2UEUg8w4SIjghY%3DT5u51URhC7zQws7L1IOR2u5wzJ5c3rYb63rqEkavUF5ioxnFHl";
    const twitterHeaders = {
      Authorization: `Bearer ${twitterApiToken}`
    };

    axios
      .request({
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
      .then(result => {
        if (result.status === 200) {
          resolve(result.data.statuses);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};
