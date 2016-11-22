require('dotenv').config();
var chalk = require('chalk');
var clear = require('clear');
var CLI = require('clui');
var figlet = require('figlet');
var inquirer = require('inquirer');
var Spinner= CLI.Spinner;
var fs = require('fs');
var staticIds = require('./staticids');
var contentFilters = require('./contentFilters');

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
  if (process.env.HUB_ID) {
    console.log('You are working with portal ' + process.env.HUB_ID);
  }
}


function buildQueryString(answersObj) {
  var answers = answersObj[0];
  var qs = {};

  if (answers.method === 'get') {
    // All Get Requests
    qs.limit = 2500;
    if (process.env.AUTH_TYPE === "access_token") {
      qs.access_token = process.env.ACCESS_TOKEN_KB;
    }
    if (process.env.AUTH_TYPE === "hapikey") {
      qs.hapikey = process.env.ACCESS_TOKEN_KB;
    }
    if (answers.name) { qs.name__icontains = answers.name; }
    if (answers.slug) { qs.slug = answers.slug; }
    if (answers.campaign) { qs.campaign = staticIds.campaignIds[answers.campaign]; }
    // Blog Post, GET query string
    if (answers.contentType === 'blog-posts') {
      qs.content_group_id = staticIds.groupIds[answers.contentGroupId];
      if (answers.postState !== 'ALL') { qs.state = answers.postState; }
    }
    // Pages, GET query string
    if (answers.contentType === 'pages') {
      qs.draft = answers.draft;
    }
  }
  return qs;
}

function getUserPreferences(callback) {
  var questions = [
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
          if (answers.contentType === 'blog-posts') {
            return (answers.method === 'get');
          }
        }
      },
      { // GET: If BLOG POSTS is selected
        name: 'postState',
        type: 'list',
        message: 'Select pages in which state?:',
        choices: ['DRAFT','PUBLISHED','SCHEDULED','ALL'],
        when: function(answers) {
          if (answers.contentType === 'blog-posts') {
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
        { // GET: If Slug Name is selected
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

showFiglet();
getUserPreferences(function() { buildRequest(arguments); });


//NOTE: use answers to build correct json payload/or query params

function buildRequest() {
  var answers = arguments[0];
 // NOTE ITS WORKING
  var queryString = buildQueryString(answers),
      cosContentType = answers.contentType,
      filter = contentFilters.noFilter;
      console.log(queryString);
  // getContentIds(filter, cosContentType, queryString);
}


module.exports = getUserPreferences;
