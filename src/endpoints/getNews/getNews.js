'use strict';

var axios = require("axios");

module.exports.handler = async event => {

  const newsApiUrl = "https://newsapi.org/v2/";
  const newsApiToken = "ed62172b723f4a598514e9a0aec3d2ae";
  const newsApiHeaders = { Accept: "application/json" };

  let url;
  const params = {
    apiKey: newsApiToken,
    pageSize: 30
  };

  if (query) {
    url = "everything";
    params.q = query;
    params.language = "pt";
    params.sortBy = "popularity";
  } else {
    url = "top-headlines";
    params.q = "a";

    if (category !== "world") {
      params.country = "br";
      params.language = "pt";
    }

    if (category !== "world" && category !== "brasil") {
      params.category = category;
    }
  }

  return new Promise((resolve, reject) => {
    axios
      .request({
        url: url,
        baseURL: newsApiUrl,
        headers: newsApiHeaders,
        params: params
      })
      .then(result => {
        if (result.status === 200) {
          resolve(result.data.articles);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};
