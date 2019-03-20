const request = require("request");
const rp = require("request-promise-native");
const async = require("async");
const values = require('object.values');
const fs = require('fs');
const Converter = require('csvtojson').Converter;
const config = require('../static/config.json');
const importsFolder = process.env.HOME + '/' + config.usersFolder + '/hub-batch/imports';
const limit = 300;
let offset = 0;

module.exports = (function() {

  function getRequestV2() {
    let options = {
      method: 'GET',
      url: 'https://api.hubapi.com/content/api/v2/blog-posts',
      qs:
       { access_token: process.env.AUTH_TOKEN,
         state: 'PUBLISHED',
         limit: limit, // Maximum 300
         offset:  offset,
         content_group_id: 3345520891, // EN KB Articles
       },
      headers:
       { 'cache-control': 'no-cache' },
      json: true
    };

    function loopableRequest() {
      return new Promise(resolve => {
        rp(options).then(body => {
          options.qs.offset += limit + 1;
          resolve(body);
        } );
      });
    }

    async function asyncCall() {
      console.log('calling');
      for (let i = 0; i < 3 ; i++) {
        let result = await loopableRequest();
        console.log(result.offset);
      }
    }

    // TODO consider using paralell or similar instead. Also try on better wifi lol

    asyncCall();

    // rp(options)
    //   .then(function (body) {
    //     const posts = body.objects;
    //     const total = body.total;
    //     const loopCount = Math.ceil(total/limit);
    //     posts.map(function (post) {
    //       console.log('id', post.id, 'name', post.name, 'url', post.url)
    //     });
    //   })
    //   .catch(function (err) {
    //   });
  }

  function makeGetRequestV2() {
    getRequestV2();
    // readPageIdCSV(chosenCSVFile)
    //   .then(createFunctionList)
    //   .then(getAnalyticsValues).then(function(listOfValuesArrays) {
    //     let file = fs.createWriteStream('array-20190209-email.csv');
    //     file.on('error', function(err) { console.log(err); });
    //     listOfValuesArrays.forEach(function(valuesArrays) {
    //       if (valuesArrays) {
    //         valuesArrays.forEach(function (array) {
    //           if (Object.keys(array).length > 0) {
    //             file.write(array.join(', ') + '\n');
    //           }
    //         });
    //       }
    //     });
    //     file.end();
    //   });
  }
  return { makeGetRequestV2: makeGetRequestV2 };
})();
