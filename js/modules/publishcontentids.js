var request = require("request");

function publishContentIds(jsonObj, cosContentType, queryString) {
  function postContentIds(element) {
    var options = {
      method: 'POST',
      url: 'http://api.hubapi.com/content/api/v2/'+ cosContentType +'/'+
            element.id + '/publish-action',
      qs: {access_token: '9450ce81-cbe0-47d3-a095-4e0c38721c3e'},
      headers:{'cache-control': 'no-cache'},
      body: '{"action": "schedule-publish"}'
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      if (response.statusCode !== 200) {
        throw new Error(response.statusCode + ": " + response.body);
      }
    });
  }
  //perform this publishing POST on each article in the jsonObj
  jsonObj.forEach(postContentIds);
}

module.exports = publishContentIds;
