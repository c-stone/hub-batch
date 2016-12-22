var request = require("request"),
    inquirer = require('inquirer'),
    fs = require('fs'),
    helpers = require('./helpers'),
    contentFilters = require('../static/contentfilters');

var homeDirectory = process.env.HOME;

//TODO: set up dotenv path using user input!
var setup = {
  getSetupDetails: function() {
    var questions = [
      {
        name: 'directoryPath',
        type: 'list',
        message: 'Where would you like to place the hub-batch working directory?',
        choices: helpers.getFolders(homeDirectory)
      },
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
    inquirer.prompt(questions).then(function(answers) {
      setup.createHubBatchFolder(answers);
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
  createEnvFile: function(answersObj, path) {
    var envFile = 'AUTH_TYPE=' + answersObj.authType + '\n' +
                  'AUTH_TOKEN=' + answersObj.authToken + '\n' +
                  'HUB_ID=' + answersObj.hubId + '\n' +
                  'HOMEDIR=' + answersObj.directoryPath;
    fs.writeFile(path+'/.env', envFile, function (err) {
       if (err) { return console.log("error: " + err); }
       console.log("The ENV file was saved!");
    });
  },
  createHubBatchFolder: function(answersObj) {
    var userSelectedFolder = process.env.HOME+'/'+
                             answersObj.directoryPath+'/hub-batch';
    fs.mkdir(userSelectedFolder, function() {
      fs.mkdirSync(userSelectedFolder + '/imports');
      fs.mkdirSync(userSelectedFolder + '/export');
    });
    setup.createEnvFile(answersObj, userSelectedFolder);
    require('dotenv').config({path: userSelectedFolder+'/.env'});
  }
};

testObj = {
  directoryPath: "Documents",
  authType: 'access_token',
  authToken: '666555-555666-556655-66565555-666-666-666',
  hubId: '53'
};

// setup.createHubBatchFolder(testObj);
setup.getSetupDetails();
