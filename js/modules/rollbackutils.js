var request = require("request"),
    async = require("async"),
    fs = require('fs'),
    config = require('../static/config.json'),
    Converter = require('csvtojson').Converter,
    importsFolder = process.env.HOME+ '/'+ config.usersFolder+ '/hub-batch/imports',
    count = 1;

// Global Variables set by user input
var csvFileName,
    queryString,
    cosContentType;

module.exports = (function() {
  function makeRollbackRequest(answersObj) {
    cosContentType = answersObj.contentType;
    queryString = buildQueryString(answersObj);
    csvFileName = importsFolder + '/' + answersObj.rollbackFilename;

    fetchCsvData(csvFileName).then(function(pageDataObject) {
      return createBatches(pageDataObject);
    })
    .then(function(batchedPagesObject) {
      batchRollbackContent(batchedPagesObject);
    });
  }

  function fetchPreviousVersionId(pageId) {
    return new Promise(function(resolve, reject) {
      var getOptions = {
        method: 'GET',
        qs: queryString,
        url: 'http://api.hubapi.com/content/api/v2/'+ cosContentType+
             '/'+ pageId+ '/versions',
        headers:{
          'cache-control': 'no-cache',
        },
      };
      request(getOptions, function (error, response, body) {
        if ( error ) throw new Error(error);
        if ( response.statusCode !== 200 ) {
          throw new Error(response.statusCode+ ": "+ JSON.stringify(response.body));
        }
        var parsedBody = JSON.parse(body),
            previousVersionId = parsedBody[1].version_id, // move back 1 revision
            contentVersionInfo = {
              pageId: pageId,
              previousVersionId: previousVersionId
            };
        resolve(contentVersionInfo);
      });
    });
  }

  function postPreviousVersion(versionInfoObj) {
    var postOptions = {
      method: 'POST',
      url: 'http://api.hubapi.com/content/api/v2/'+ cosContentType +'/'+
            versionInfoObj.pageId + '/versions/restore',
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/jsons'
      },
      body: { "version_id": versionInfoObj.previousVersionId },
      qs: queryString,
      json: true
    };
    request(postOptions, function(error, response, body) {
      if ( error ) throw new Error(error);
      if ( response.statusCode !== 200 ) {
        console.warn([response.statusCode, versionInfoObj.pageId]);
      } else {
        console.log([response.statusCode, versionInfoObj.pageId]);
      }
    });
  }

  function rollbackContent(pageObject) {
    var pageId = pageObject.id;
    fetchPreviousVersionId(pageId)
    .then(function(versionInfo) {
      postPreviousVersion(versionInfo);
    });
  }

  function batchRollbackContent(batchedPagesObject) {
    async.eachLimit(batchedPagesObject, 1, function(collection, callback) {
        collection.forEach(rollbackContent);
        console.log('Processing Collection #'+ count +' of '+ batchedPagesObject.length);
        ++count;
        setTimeout(callback, 1000);
    },
    function(err) {
        if ( err ) { // if any of the file produced an error, error is printed
          console.log('A file failed to process'); // All processing will now stop
        } else {
          console.log('All files have been processed successfully');
        }
    });
  }

  function buildQueryString(answersObj) {
    var answers = answersObj[0];
    var qs = {};
    if (process.env.AUTH_TYPE === "access_token") {
      qs.access_token = process.env.AUTH_TOKEN;
    }
    if (process.env.AUTH_TYPE === "hapikey") {
      qs.hapikey = process.env.AUTH_TOKEN;
    }
    return qs;
  }

  function createBatches(pagesDataObject) {
    return new Promise(function(resolve, reject) {
      var batchArray = [];
      do { //populate batchArray with page content divided into 10s
        for (; pagesDataObject.length > 0;) {
          batchArray.push(pagesDataObject.splice(0, 3)); //batchArray created
        }
      } while (pagesDataObject.lenth > 0);
      resolve(batchArray);
    });
  }

  function fetchCsvData(csvFileName) {
    return new Promise(function(resolve, reject) {
      csvConverter=new Converter({}); // new converter instance
      csvConverter.on('end_parsed', function(pageDataObject) { // Converts csv to json object
        if ( pageDataObject ) {
          resolve(pageDataObject);
        }
        else {
          reject(console.log("not working"));
        }
      });
      fs.createReadStream(csvFileName).pipe(csvConverter); //read from file
    });
  }

  return {
    makeRollbackRequest: makeRollbackRequest,
  };
})();
