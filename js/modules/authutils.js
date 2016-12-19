require('dotenv').config();
var request = require("request"),
    inquirer = require('inquirer'),
    fs = require('fs');


var authUtils = {
  getAuthCreds: function() {
    var questions = [
      {
        name: 'authType',
        type: 'list',
        message: 'What type of authentation would you like to use?',
        choices: ['hapikey', 'access_token']
      },
      {
        name: 'authToken',
        type: 'input',
        message: 'Enter your authentication token:',
        validate: function(input) {
          if (input.length > 34) {
            return true;
          } else {
            return 'Enter a valid authentication token:';
          }
        }
      },
      {
        name: 'hubId',
        type: 'input',
        message: 'Enter the Hub ID of the portal you are working with:',
        validate: function(input) {
          if (input.length >= 2) {
            return true;
          } else {
            return 'Enter a valid Hub ID';
          }
        }
      },
    ];
    // Ask user questions, then run a callback function
    inquirer.prompt(questions).then(function(){
      console.log(answers);
    });
  },
  isAuthTokenValid: function() {
    return new Promise(function(resolve, reject) {
      var authType = process.env.AUTH_TYPE,
          authToken = process.env.AUTH_TOKEN;
      var options = {
        method: 'GET',
        url: 'http://api.hubapi.com/content/api/v2/blogs',
        qs: {},
        headers: {'cache-control': 'no-cache'}
      };
      options.qs[authType] = authToken;
      console.log(options);
      request(options, function (error, response, body) {
        if (error) { reject(Error(response.statusCode+": "+
                                  JSON.stringify(response.body))); }
        resolve(response.statusCode);
      });
    });
  },
  createEnvFile: function(answersObj) {
    var envFile = 'AUTH_TYPE=' + answersObj.authType + '\n' +
                  'AUTH_TOKEN=' + answersObj.authToken + '\n' +
                  'HUB_ID=' + answersObj.hubId;
    fs.writeFile('./././.env', envFile, function (err) {
       if (err) { return console.log("error: " + err); }
       console.log("The ENV file was saved!");
    });
  }
};

// Check if ENV variables present
if ( process.env.AUTH_TOKEN ) {
  authUtils.isAuthTokenValid().then(function(tokenValidity) {
    console.log("VALIDITY:" + tokenValidity);
    if ( !tokenValidity ) {
      authUtils.getAuthCreds().then(createEnvFile(answersObj));
    }
  });
}


  // ENV vars not present

    // Move on


      // Token not valid
        // Ask for new Token
      // Token is valid
        //move on


// authUtils.getAuthCreds();
// module.exports = (function() {
//   function checkAuthentication(answersObj) {
//     if (doesEnvFileExist()) {
//       isAuthTokenValid().then(function(authStatus) {
//         if (!authStatus) {
//           createEnvFile(answersObj);
//         }
//       });
//     }
//   }
//
//   function doesEnvFileExist() {
//     var rootDirectory = './././';
//     var rootFilesArr = fs.readdirSync(rootDirectory);
//     return filesArr.indexOf('.env') !== -1 &&
//            filesArr.indexOf('sample.env') === -1;
//   }
//
//   function isAuthTokenValid() {
//     return new Promise(function(resolve, reject) {
//       var authType = process.env.AUTH_TYPE,
//           authToken = process.env.AUTH_TOKEN;
//       var options = {
//         method: 'GET',
//         url: 'http://api.hubapi.com/content/api/v2/blogs',
//         qs: { authType: authToken },
//         headers: {'cache-control': 'no-cache'}
//       };
//       request(options, function (error, response, body) {
//         if (error) { reject(Error(response.statusCode+": "+
//                                   JSON.stringify(response.body))); }
//         resolve(response.statusCode);
//       });
//     })
//     .then(function(statusCode) {
//         return (statusCode === 200);
//     });
//   }
//
//   function createEnvFile(answersObj) {
//     var envFile = 'AUTH_TYPE=' + answersObj.authType + '\n' +
//                   'AUTH_TOKEN=' + answersObj.authToken + '\n' +
//                   'HUB_ID=' + answersObj.hubId;
//     fs.writeFile('./././.env', envFile, function (err) {
//        if (err) { return console.log("error: " + err); }
//        console.log("The ENV file was saved!");
//     });
//   }
//
//   return {
//     checkAuthentication: checkAuthentication,
//   };
// })();
