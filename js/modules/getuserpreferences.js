'esversion: 6';

var chalk       = require('chalk');
var clear       = require('clear');
var CLI         = require('clui');
var figlet      = require('figlet');
var inquirer    = require('inquirer');
var Preferences = require('preferences');
var Spinner     = CLI.Spinner;
var fs          = require('fs');
var staticIds   = require("./staticids");
var prefs = new Preferences('HubBatch');

var importsFolder = './././imports/';
var filesArr = getImportFilesArray(); // creates array of files in ./js/imports
filesArr.shift();

function getImportFilesArray() {
  return fs.readdirSync(importsFolder, function(err, files) {
  });
}

function showFiglet() {
  clear();
  console.log(
    chalk.yellow(
      figlet.textSync('Hub-Batch', { horizontalLayout: 'full', font: 'doom' })
    )
  );
}

function getUserPreferences(callback) {
  var questions = [
    {
      name: 'key',
      type: 'password',
      message: 'Enter your hapikey:',
      validate: function(value) {
        if (value.length > 30) {
          return true;
        } else {
          return 'Please enter a valid hapikey';
        }
      },
      when: function() {
        if (prefs.account &&
            prefs.account.hapikey &&
            process.argv[2] !== 'change-key') { // Add 'change-key' argument to
          return false;                         // update existing hapikey
        } else {
          return true;
        }
      }
    },
    {
      name: 'contentType',
      type: 'list',
      message: 'What type of content?',
      choices: ['blog-posts', 'pages']
    },
    {
      name: 'method',
      type: 'list',
      message: 'What type of operation would you like to perform?:',
      choices: ['get', 'update', 'publish']
    },
      // Begin GET Options
      { // GET: If BLOG POSTS is selected
        name: 'contentGroupId',
        type: 'list',
        message: 'Which blog would you like to Get?:',
        choices: Object.keys(staticIds.groupIds),
        when: function(answers) {
          if (answers.contentType === 'blog posts') {
            return (answers.method === 'get');
          }
        }
      },
      { // GET: If BLOG POSTS is selected
        name: 'postState',
        type: 'list',
        message: 'Select pages in which state?:',
        choices: ['DRAFT','PUBLISHED','SCHEDULED'],
        when: function(answers) {
          if (answers.contentType === 'blog posts') {
            return (answers.method === 'get');
          }
        }
      },
      { // GET: If PAGES is selected
        name: 'draft',
        type: 'confirm',
        message: 'Search for drafts too?:',
        default: false,
        when: function(answers) {
          if (answers.contentType === 'pages') {
            return (answers.method === 'get');
          }
        }
      },
      { // GET: Options to refine search
        name: 'refineOptions',
        type: 'checkbox',
        message: 'How would you like to refine your GET request?:',
        choices: ['Campaign', 'Name', 'Slug' ],
        default: ['none'],
        when: answers => (answers.method === 'get')
      },
        { // GET: If Campaign is Selected
          name: 'campaign',
          type: 'list',
          message: 'Select a campaign:',
          choices: Object.keys(staticIds.campaignIds),
          when: function(answers) {
            if (answers.refineOptions) {
              return (answers.refineOptions.indexOf("Campaign") !== -1);
            }
          }
        },
        { // GET: If Name is selected
          name: 'name',
          type: 'input',
          message: 'Return page names containing:',
          validate: function(input) {
            if (input.length) {
              return true;
            } else {
              return 'Enter a search word:';
            }
          },
          when: function(answers) {
            if (answers.refineOptions) {
              return (answers.refineOptions.indexOf("Name") !== -1);
            }
          }
        },
        { // GET: If Name is selected
          name: 'slug',
          type: 'input',
          message: 'Return content with a slug containing:',
          validate: function(input) {
            if (input.length) {
              return true;
            } else {
              return 'Enter a search word:';
            }
          },
          when: function(answers) {
            if (answers.refineOptions) {
              return (answers.refineOptions.indexOf("Slug") !== -1);
            }
          }
        },
    // Begin UPDATE/PUBLISH options
    { // If UPDATE or PUBLISH are selected
      name: 'importFilename',
      type: 'list',
      message: 'Which file you would like to import?:',
      choices: filesArr,
      when: answers => (answers.method !== 'get')
    },
  ];

  // Ask user questions, then run a callback function
  inquirer.prompt(questions).then(callback);
}

//NOTE: use answers to build correct json payload/or query params

showFiglet();
getUserPreferences();

function constructor() {
  var answers = arguments[0];
  console.log(answers);
  prefs.account.hapikey = answers.key;
}



module.exports = getUserPreferences;
