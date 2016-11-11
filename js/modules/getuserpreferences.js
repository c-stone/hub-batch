'esversion: 6';

var chalk       = require('chalk');
var clear       = require('clear');
var CLI         = require('clui');
var figlet      = require('figlet');
var inquirer    = require('inquirer');
var Preferences = require('preferences');
var Spinner     = CLI.Spinner;
var fs          = require('fs');

var importsFolder = './././imports/';
var filesArr = getImportFilesArray();
filesArr.shift();

function getImportFilesArray() {
  return fs.readdirSync(importsFolder, function(err, files) {
  });
}

function getGithubCredentials(callback) {
  var questions = [
    {
      name: 'contentType',
      type: 'list',
      message: 'What type of content?',
      choices: ['Blog Posts', 'Pages']
    },
    {
      name: 'method',
      type: 'list',
      message: 'What type of operation would you like to perform?',
      choices: ['Get', 'Update', 'Publish']
    },
    {
      name: 'importFilename',
      type: 'list',
      message: 'What is the name of the file you would like to import? (must be .csv)',
      choices: filesArr,
      when: answer => (answer.method === 'Update' || 'Publish')//function(answer) {return (answer.method === 'Update' || 'Publish');}
    },
    {
      name: 'password',
      type: 'password',
      message: 'Enter your password:',
      validate: function(value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your password';
        }
      }
    }
  ];

  inquirer.prompt(questions).then(callback);
}


clear();
console.log(
  chalk.yellow(
    figlet.textSync('Hub-Batch', { horizontalLayout: 'full', font: 'doom' })
  )
);

getGithubCredentials(function(){
  console.log(arguments);
});
