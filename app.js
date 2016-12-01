#!/usr/bin/env node
require('dotenv').config(); //Set up local enviroment, for authentication

var getUtils = require('./js/modules/getutils'),
    updateUtils = require('./js/modules/updateutils'),
    publishContentIds = require('./js/modules/publishContentIds'),
    cliUtils = require('./js/modules/cliutils'),
    contentFilters = require('./js/static/contentfilters'),
    staticIds = require('./js/static/staticids'),
    fs = require('fs'),
    Converter = require('csvtojson').Converter;

/////NOTE I need to figure out how to handle the query string for blog vs pages
// var csvFileName = './imports/' + process.argv[3];

cliUtils.showFiglet();
cliUtils.getUserPreferences(function(answersObj) {
  var method = answersObj.method;
  if ( method === 'get' ) {
    getUtils.makeGetRequest(answersObj);
  } else if ( method === 'update' ) {
    updateUtils.makeUpdateRequest(arguments);
  } else if ( method === 'publish' ) {

  }
 });


  //  csvConverter=new Converter({}); // new converter instance
  //  csvConverter.on('end_parsed', function(jsonObj) { // Converts csv to json object
  //    var pageId = jsonObj[0].id;
  //    delete jsonObj[0].id;
  //    console.log(pageId, jsonObj[0]);
  //    console.log(jsonObj[0].widgets);
  //  });
  //  fs.createReadStream(csvFileName).pipe(csvConverter); //read from file


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
