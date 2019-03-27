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
        function analyticsRequest(callback) {
          let options2 = {
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
            ++ counter;
            let bodyKeys = Object.keys(body);
            let bodyValues = Object.values(body);
            let dateValues = bodyValues.map(function(datesList, i) {
              if (datesList[0]) {
                let valueList = [];
                valueList.push(datesList[0].breakdown);
                valueList.push(datesList[0].rawViews);
                valueList.push(datesList[0].entrances);
                valueList.push(datesList[0].exits);
                valueList.push(datesList[0].pageTime);
                valueList.push(bodyKeys[i]); // date
                return valueList;
              } else {
                return [];
              }
            });
            callback(null, dateValues);
          });
        };
        return analyticsRequest;
      });
      if (seriesOfFunctions.length === idsObject.length) {
        resolve(seriesOfFunctions);
      }
    });
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
      });
    });
  }

  function makeAnalyticsRequest(answersObj) {
    const contentType = answersObj.contentType; // blog or site page
    const chosenCSVFile = importsFolder + '/' + answersObj.importFilename;
    readPageIdCSV(chosenCSVFile)
      .then(createFunctionList)
      .then(getAnalyticsValues).then(function(listOfValuesArrays) {
        let file = fs.createWriteStream('array-20190209-email.csv');
        file.on('error', function(err) { console.log(err); });
        listOfValuesArrays.forEach(function(valuesArrays) {
          if (valuesArrays) {
            valuesArrays.forEach(function (array) {
              if (Object.keys(array).length > 0) {
                file.write(array.join(', ') + '\n');
              }
            });
          }
        });
        file.end();
      })
  };
  return { makeAnalyticsRequest: makeAnalyticsRequest };
})();
