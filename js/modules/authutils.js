require('dotenv').config();
var request = require("request"),
    fs = require('fs');

module.exports = (function() {
  function checkAuthentication(answersObj) {
    if (doesEnvFileExist()) {
      isAuthTokenValid().then(function(authStatus) {
        if (!authStatus) {
          createEnvFile(answersObj);
        }
      });
    }
  }

  function doesEnvFileExist() {
    var rootDirectory = './././';
    var rootFilesArr = fs.readdirSync(rootDirectory);
    return filesArr.indexOf('.env') !== -1 &&
           filesArr.indexOf('sample.env') === -1;
  }

  function isAuthTokenValid() {
    return new Promise(function(resolve, reject) {
      var authType = process.env.AUTH_TYPE,
          authToken = process.env.AUTH_TOKEN;
      var options = {
        method: 'GET',
        url: 'http://api.hubapi.com/content/api/v2/blogs',
        qs: { authType: authToken },
        headers: {'cache-control': 'no-cache'}
      };
      request(options, function (error, response, body) {
        if (error) { reject(Error(response.statusCode+": "+
                                  JSON.stringify(response.body))); }
        resolve(response.statusCode);
      });
    })
    .then(function(statusCode) {
        return (statusCode === 200);
    });
  }

  function createEnvFile(answersObj) {
    var envFile = 'AUTH_TYPE=' + answersObj.authType + '\n' +
                  'AUTH_TOKEN=' + answersObj.authToken + '\n' +
                  'HUB_ID=' + answersObj.hubId;
    fs.writeFile('./././.env', envFile, function (err) {
       if (err) { return console.log("error: " + err); }
       console.log("The ENV file was saved!");
    });
  }

  return {
    checkAuthentication: checkAuthentication,
  };
})();
