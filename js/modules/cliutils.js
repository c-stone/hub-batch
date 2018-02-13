var chalk = require('chalk'),
    clear = require('clear'),
    figlet = require('figlet'),
    inquirer = require('inquirer'),
    fs = require('fs'),
    helpers = require('./helpers'),
    config = require('../static/config.json'),
    staticIds = require('../static/staticids'),
    contentFilters = require('../static/contentfilters'),
    importsFolder = process.env.HOME+ '/'+ config.usersFolder+ '/hub-batch/imports';


var cliUtils = {
  showFiglet: function() {
    clear();
    console.log(
      chalk.yellow(
        figlet.textSync('Hub-Batch', { horizontalLayout: 'full', font: 'doom' })
      )
    );
    if (process.env.HUB_ID) {
      console.log('You are working with portal ' + process.env.HUB_ID);
    }
  },
  getUserPreferences: function(callback) {
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
        choices: ['GET JSON', 'Update Buffer JSON', 'Push Buffer Live', 'Update Hard Object JSON', 'Publish Action', 'Rollback Hard Object JSON', 'Create Posts or Pages']
      },
        // Begin GET Options
        { // GET: If BLOG POSTS is selected
          name: 'contentGroupId',
          type: 'list',
          message: 'Which blog would you like to Get?:',
          choices: Object.keys(staticIds.groupIds),
          when: function(answers) {
            if (answers.contentType === 'blog-posts') {
              return (answers.method === 'GET JSON');
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
              return (answers.method === 'GET JSON');
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
              return (answers.method === 'GET JSON');
            }
          }
        },
        { // GET: Options to refine search
          name: 'refineOptions',
          type: 'checkbox',
          message: 'How would you like to refine your GET request?:',
          choices: ['Campaign', 'Topic', 'Name', 'Slug'],
          default: ['none'],
          when: answers => (answers.method === 'GET JSON' && answers.contentType === 'blog-posts')
        },
        { // GET: Options to refine search
          name: 'refineOptions',
          type: 'checkbox',
          message: 'How would you like to refine your GET request?:',
          choices: ['Campaign', 'Name', 'Slug'],
          default: ['none'],
          when: answers => (answers.method === 'GET JSON' && answers.contentType === 'pages')
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
          { // GET: If Campaign is Selected
            name: 'topic',
            type: 'list',
            message: 'Select a campaign:',
            choices: Object.keys(staticIds.topicIds),
            when: function(answers) {
              if (answers.refineOptions) {
                return (answers.refineOptions.indexOf("Topic") !== -1);
              }
            }
          },
          { // GET: If Name is selected
            name: 'name',
            type: 'input',
            message: 'Return page names containing the following word(s):',
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
            message: 'Return content with a slug containing (exact match):',
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
      // Begin UPDATE/PUBLISH/BUFFER/PUSHBUFFERLIVE options
      { // If UPDATE, BUFFER, PUSHBUFFERLIVE or PUBLISH are selected
        name: 'importFilename',
        type: 'list',
        message: 'Which file you would like to import?:',
        choices: helpers.getFolders(importsFolder),
        //TODO: this is appearing for GET as well as UPDATE/PUBLISH
        when: answers => (answers.method === 'Update Hard Object JSON' || answers.method === 'Publish Action' || answers.method === 'Update Buffer JSON' || answers.method === 'Push Buffer Live' || answers.method === 'Create Posts or Pages') 
      },
      // Begin ROLLBACK options
      {
        name: 'rollbackFilename',
        type: 'list',
        message: 'Which file contains the content you\'d like to rollback 1 version?:',
        choices: helpers.getFolders(importsFolder),
        when: answers => (answers.method === 'Rollback Hard Object JSON')
      }
    ];
    // Ask user questions, then run a callback function
    inquirer.prompt(questions).then(callback);
  },
};

module.exports = cliUtils;
