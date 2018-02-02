#!/usr/bin/env node
var getUtils = require('./js/modules/getutils'),
    updateUtils = require('./js/modules/updateutils'),
    updateBufferUtils = require('./js/modules/updatebufferutils'),
    pushBufferLiveUtils = require('./js/modules/pushbufferliveutils'),
    publishUtils = require('./js/modules/publishutils'),
    rollbackUtils = require('./js/modules/rollbackutils'),
    createPostUtils = require('./js/modules/postcreationutils'),
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
        if ( method === 'GET JSON' ) {
          getUtils.makeGetRequest(answersObj);
        }
        else if ( method === 'Update Buffer JSON' ) {
          updateBufferUtils.makeUpdateBufferRequest(answersObj);
        }
        else if ( method === 'Push Buffer Live' ) {
          pushBufferLiveUtils.makePushBufferLiveRequest(answersObj);
        }
        else if ( method === 'Update Hard Object JSON' ) {
          updateUtils.makeUpdateRequest(answersObj);
        }
        else if ( method === 'Publish Action' ) {
          publishUtils.makePublishRequest(answersObj);
        }
        else if ( method === 'Rollback Hard Object JSON' ) {
          rollbackUtils.makeRollbackRequest(answersObj);
        }
        else if ( method === 'Create Posts' ) {
          createPostUtils.makePostCreationRequest(answersObj);
        }
      });
    }
  });
}
