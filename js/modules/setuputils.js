var request = require("request"),
    inquirer = require('inquirer'),
    fs = require('fs'),
    helpers = require('./helpers'),
    config = require('../static/config.json'),
    contentFilters = require('../static/contentfilters');

var homeDirectory = process.env.HOME;

var setup = {
  getSetupDetails: function() {
    var questions = [
      {
        name: 'directoryPath',
        type: 'list',
        message: 'Where would you like to place the hub-batch working directory?',
        choices: helpers.getFolders(homeDirectory),
        when: (!config.usersFolder)
      },
      {
        name: 'authType',
        type: 'list',
        message: 'What type of authentation would you like to use?',
        choices: ['access_token', 'hapikey']
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
      request(options, function (error, response, body) {
        if (error) { reject(Error(response.statusCode+": "+
                                  JSON.stringify(response.body))); }

        resolve(response.statusCode);
      });
    });
  },
  createConfigFiles: function(answersObj, path) {
    var envFile = 'AUTH_TYPE=' + answersObj.authType + '\n' +
                  'AUTH_TOKEN=' + answersObj.authToken + '\n' +
                  'HUB_ID=' + answersObj.hubId + '\n';
        configFile = JSON.stringify({
          usersFolder: answersObj.directoryPath
        });


    fs.writeFile(path+'/.env', envFile, function (err) {
       if (err) { return console.log("error: " + err); }
       console.log("The ENV file was saved!");
    });
    if (!config.usersFolder) {
      fs.writeFile('./js/static/config.json', configFile, function (err) {
         if (err) { return console.log("error: " + err); }
         console.log("The Config file was saved!");
      });
    }
    console.log("Configuration saved! Rerun hub-batch");
  },
  createHubBatchFolder: function(answersObj) {
    var userSelectedFolder;
    if (answersObj.directoryPath) {
      userSelectedFolder = process.env.HOME+ '/'+
                           answersObj.directoryPath+ '/hub-batch';
    }
    if (config.usersFolder) {
      userSelectedFolder = process.env.HOME+ '/'+
                           config.usersFolder+ '/hub-batch';
    }
    if (!fs.existsSync(userSelectedFolder + "/imports")) {
      fs.mkdir(userSelectedFolder, function() {
        fs.mkdirSync(userSelectedFolder+ '/imports');
        fs.mkdirSync(userSelectedFolder+ '/exports');
      });
    }
    setup.createConfigFiles(answersObj, userSelectedFolder);
  }
};


module.exports = setup;
