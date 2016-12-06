var request = require("request"),
    async = require("async"),
    fs = require('fs'),
    Converter = require('csvtojson').Converter,
    count = 1; // used for displaying which batch is being processed

// Global Variables set by user input
var csvFileName,
    queryString,
    cosContentType;

module.exports = (function() {
  function makeUpdateRequest(answersObj) {
        cosContentType = answersObj.contentType;
        queryString = buildUpdateQueryString(answersObj);
        csvFileName = './imports/' + answersObj.importFilename;


      fetchCsvData(csvFileName).then(function(pageDataObject) {
        return createBatches(pageDataObject);
      }).then(function(batchedPagesObject) {
        batchUpdateContent(batchedPagesObject);
      });
  }

  function buildUpdateQueryString(answersObj) {
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

  function putContentUpdates(pageData) {
    var pageId = pageData.id;
    delete pageData.id; // remove ID from data, since only used in request
    // Format Request
    var options = {
      method: 'PUT',
      url: 'http://api.hubapi.com/content/api/v2/'+ cosContentType +'/'+ pageId,
      qs: queryString,
      headers: {'cache-control': 'no-cache'},
      json: pageData
    };
    // Make Request
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      if (response.statusCode !== 200) {
        throw new Error(response.statusCode + ": " + JSON.stringify(response.body));
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
