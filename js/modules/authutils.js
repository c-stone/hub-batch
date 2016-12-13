var request = require("request"),
    fs = require('fs');

module.exports = (function() {
  function checkAuth() {
    if (process.env.AUTH_TYPE === 'hapikey') {
      console.log("Authenticated with hapikey");
    }
    else if (process.env.AUTH_TYPE === 'access_token') {
      var options = {
        method: 'GET',
        url: 'http://api.hubapi.com/content/api/v2/blogs',
        qs: { access_token: process.env.AUTH_TOKEN },
        headers: {'cache-control': 'no-cache'}
      };
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        if (response.statusCode !== 200)
        {
          console.log("Access token expired, enter updated token");
        }
      });
    }
  }
  // TODO: test if checkAuth works and build check for env file function
  function checkForEnvFile() {

  }

  return {
    makePublishRequest: makePublishRequest,
  };
})();
