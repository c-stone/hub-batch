#!/usr/bin/env node
require('dotenv').config(); //Set up local enviroment, for authentication

var getUtils = require('./js/modules/getutils'),
    updateUtils = require('./js/modules/updateutils'),
    publishUtils = require('./js/modules/publishutils'),
    rollbackUtils = require('./js/modules/rollbackutils'),
    authUtils = require('./js/modules/authutils'),
    cliUtils = require('./js/modules/cliutils');

cliUtils.showFiglet();
cliUtils.getUserPreferences(function(answersObj) {
  authUtils.checkAuthentication(answersObj);
  var method = answersObj.method;
  if ( method === 'get' ) {
    getUtils.makeGetRequest(answersObj);
  }
  else if ( method === 'update' ) {
    updateUtils.makeUpdateRequest(answersObj);
  }
  else if ( method === 'publish' ) {
    publishUtils.makePublishRequest(answersObj);
  }
  else if ( method === 'rollback' ) {
    rollbackUtils.makeRollbackRequest(answersObj);
  }

 });
