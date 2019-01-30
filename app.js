#!/usr/bin/env node
var getUtils = require('./js/modules/getutils'),
    updateUtils = require('./js/modules/updateutils'),
    publishUtils = require('./js/modules/publishutils'),
    rollbackUtils = require('./js/modules/rollbackutils'),
    analyticsUtils = require('./js/modules/analyticsutils'),
    cliUtils = require('./js/modules/cliutils'),
    setup = require('./js/modules/setuputils'),
    config = require('./js/static/config.json');

cliUtils.showFiglet();
if ( !config.usersFolder ) {
    setup.getSetupDetails();
}
else if ( config.usersFolder ) {
  require('dotenv').config({path: process.env.HOME +'/'+ config.usersFolder +
                                  '/hub-batch/.env', silent: true});
  setup.isAuthTokenValid().then(function(status) {
    if ( status !== 200 ) {
      console.log("Your auth token is invalid or has expired. Please re-enter:");
      setup.getSetupDetails();
    }
    else if ( status === 200 ) {
      cliUtils.getUserPreferences(function(answersObj) {
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
        else if ( method === 'analytics' ) {
          analyticsUtils.makeAnalyticsRequest(answersObj);
        }
      });
    }
  });
}
