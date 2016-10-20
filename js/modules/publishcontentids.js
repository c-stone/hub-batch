var request = require("request"),
    async = require("async"),
    createBatches = require("./createbatches"),
    count = 1;

function publishContentIds(jsonObj, cosContentType, queryString) {
  function postContentIds(element) {
    var options = {
      method: 'POST',
      url: 'http://api.hubapi.com/content/api/v2/'+ cosContentType +'/'+ element.id + '/publish-action',
      qs: queryString,
      headers:{
        'cache-control': 'no-cache',
        'content-type': 'application/json'
      },
      body: {action: 'schedule-publish'},
      json: true
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log([response.statusCode, element.id]);
    });
  }

  function batchPublishContent(object) {
    var batchedObjectsCollection = createBatches(object);

    async.eachLimit(batchedObjectsCollection, 1, function(collection, callback) {
        collection.forEach(postContentIds);
        console.log('Processing Collection #'+ count +' of '+ batchedObjectsCollection.length);
        ++count;
        setTimeout(callback, 1500);
    },
    function(err) {
        if( err ) {  // if any of the files produced an error, err would equal that error
          console.log('A file failed to process'); // All processing will now stop.
        } else {
          console.log('All files have been processed successfully');
        }
    });
  }
  batchPublishContent(jsonObj);
}


module.exports = publishContentIds;
