#!/usr/bin/env node
require('dotenv').config(); //Set up local enviroment, for authentication

var getContentIds = require('./js/modules/getcontentids'),
    updateContentIds = require('./js/modules/updatecontentids'),
    publishContentIds = require('./js/modules/publishContentIds'),
    cliHelpers = require('./js/modules/clihelpers'),
    contentFilters = require('./js/static/contentfilters'),
    staticIds = require('./js/static/staticids'),
    fs = require('fs'),
    Converter = require('csvtojson').Converter;

/////NOTE I need to figure out how to handle the query string for blog vs pages
// var csvFileName = './imports/' + process.argv[3];

cliHelpers.showFiglet();
cliHelpers.getUserPreferences(function() { cliHelpers.buildRequest(arguments); });


// } else if (appAction === 'update' || 'publish') { // Used for updating pages/posts
//   csvConverter=new Converter({}); // new converter instance
//   csvConverter.on('end_parsed', function(jsonObj) { // Converts csv to json object
//       if (appAction === 'update') {
//         console.log('Updating...');
//         updateContentIds(jsonObj, cosContentType, queryString);
//       } else if (appAction === 'publish') {
//         console.log("Publishing...");
//         publishContentIds(jsonObj, cosContentType, queryString);
//       }
//   });
//   fs.createReadStream(csvFileName).pipe(csvConverter); //read from file
//
// } else {
//   console.warn("variable 'appAction' must be either 'get', 'update' or 'publish'");
// }
