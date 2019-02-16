const request = require("request");
const rp = require("request-promise-native");
const async = require("async");
const values = require('object.values');
const fs = require('fs');
const Converter = require('csvtojson').Converter;
const config = require('../static/config.json');
const importsFolder = process.env.HOME + '/' + config.usersFolder + '/hub-batch/imports';

module.exports = (function() {

  function readPageIdCSV(csvFileName) {
    return new Promise(function(resolve, reject) {
      let csvConverter = new Converter({});
      fs.createReadStream(csvFileName).pipe(csvConverter); //read from file
      csvConverter.on('end_parsed', function(idObject) { // Converts csv to json object
        if (idObject) {
          resolve(idObject);
        } else {
          reject(console.log("csvConverter() Failed"));
        }
      });
    });
  }

  function createFunctionList(idsObject) {
    return new Promise(function(resolve, reject) {
      let counter = 0;
      let seriesOfFunctions = idsObject.map(function(idObject) {
        let analyticsRequest = function(callback) {
          var options2 = {
            method: 'GET',
            url: 'https://api.hubapi.com/analytics/v2/reports/blog-posts/monthly',
            qs:
             { access_token: process.env.AUTH_TOKEN,
               start: '20180101', //YYYYMMDD
               end: '20190209',
               f: idObject.id
             },
            headers:
             { 'cache-control': 'no-cache' },
            json: true
          };
          request(options2, function (error, response, body) {
            if (error) throw new Error(error);
            ++ counter
            let bodyKeys = Object.keys(body);
            let bodyValues = Object.values(body);
            let dateValues = bodyValues.map(function(datesList, i) {
              if (datesList[0]) {
                datesList[0].month = bodyKeys[i]
                return Object.values(datesList[0])
              } else {
                return {};
              }
            });
            callback(null, dateValues)
          });
        };
        return analyticsRequest;
      });
      if (seriesOfFunctions.length === idsObject.length) {
        resolve(seriesOfFunctions)
      }
    })
  }

  function getAnalyticsValues(functionList) {
    return new Promise(function(resolve, reject) {
      async.parallel(functionList, function(err, results) {
        if (err) console.log(err);
        let valuesArray = results.map(function(result) {
          let values = Object.values(result);
          return values;
        });
        resolve(valuesArray);
      })
    })
  }

  function makeAnalyticsRequest(answersObj) {
    const contentType = answersObj.contentType; // blog or site page
    // qs = buildQueryString(answersObj);
    const chosenCSVFile = importsFolder + '/' + answersObj.importFilename;
    readPageIdCSV(chosenCSVFile)
      .then(createFunctionList)
      .then(getAnalyticsValues).then(function(listOfValuesArrays) {
        console.log('list', listOfValuesArrays[0]);
        let file = fs.createWriteStream('array-20190209-en.csv');
        file.on('error', function(err) { console.log(err); });
        listOfValuesArrays.forEach(function(valuesArray) {
          console.log("one", valuesArray);
          // file.write(v.join(', ') + '\n');
        });
        file.end();
      })
  };
  return { makeAnalyticsRequest: makeAnalyticsRequest };
})();
