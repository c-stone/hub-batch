const request = require("request"),
      async = require("async"),
      fs = require('fs'),
      Converter = require('csvtojson').Converter,
      config = require('../static/config.json'),
      importsFolder = process.env.HOME+'/'+config.usersFolder+'/hub-batch/imports';

// Global Variables set by user input
let count = 1, // used for displaying which batch is being processed
    csvFileName,
    queryString,
    cosContentType;

module.exports = (function() {
  function makeUpdateRequest(answersObj, token) {
    cosContentType = answersObj.contentType;
    csvFileName = importsFolder+ '/'+ answersObj.importFilename;

    fetchCsvData(csvFileName).then(function(pageDataObject) {
      return createBatches(pageDataObject);
    })
    .then(function(batchedPagesObject) {
      batchUpdateContent(batchedPagesObject);
    });
  }

  function putContentUpdates(pageData, accessToken) {
    let pageId = pageData.id;
    delete pageData.id; // remove ID from data, since only used in request
    if (pageData.editLink) { delete pageData.editLink; } // Remove editlink from data
    // Format Request
    let options = {
      method: 'PUT',
      url: 'http://api.hubapi.com/content/api/v2/' + cosContentType + '/' + pageId,
      headers:
        {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
      json: pageData
    };
    // Make Request
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      if (response.statusCode !== 200) {
        console.log(response.statusCode+": "+JSON.stringify(response.body));
      }
      console.log([response.statusCode, pageId]);
    });
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

  function batchUpdateContent(batchedPagesObject) {
    async.eachLimit(batchedPagesObject, 1, function(collection, callback) {
      // console.log(batchedPagesObject);
        collection.forEach(putContentUpdates);
        console.log('Processing Collection #'+ count +' of '+ batchedPagesObject.length);
        ++count;
        setTimeout(callback, 1000);
    },
    function(err) {
        if( err ) { // if any of the file produced an error, err would equal that error
          console.log('A file failed to process'); // All processing will now stop.
        } else {
          console.log('All files have been processed successfully');
        }
    });
  }

  function fetchCsvData(csvFileName) {
    return new Promise(function(resolve, reject) {
      csvConverter=new Converter({}); // new converter instance
      csvConverter.on('end_parsed', function(pageDataObject) { // Converts csv to json object
        if (pageDataObject) {
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
    makeUpdateRequest: makeUpdateRequest,
  };
})();
