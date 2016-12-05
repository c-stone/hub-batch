#!/usr/bin/env node
require('dotenv').config(); //Set up local enviroment, for authentication

var getUtils = require('./js/modules/getutils'),
    updateUtils = require('./js/modules/updateutils'),
    publishUtils = require('./js/modules/publishutils'),
    cliUtils = require('./js/modules/cliutils');

cliUtils.showFiglet();
cliUtils.getUserPreferences(function(answersObj) {
  var method = answersObj.method;
  if ( method === 'get' ) {
    getUtils.makeGetRequest(answersObj);
  } else if ( method === 'update' ) {
    updateUtils.makeUpdateRequest(answersObj);
  } else if ( method === 'publish' ) {
    publishUtils.makePublishRequest(answersObj);
  }
 });
