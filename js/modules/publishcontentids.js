var request = require("request"),
    async = require("async");

var count = 1;

function publishContentIds(jsonObj, cosContentType, queryString) {
  function groupObjectBy10s(object) {
    var contentArray = [];
    do { //populate contentArray with page content divided into 10s
      for (; object.length > 0;) {
        contentArray.push(object.splice(0, 3)); //contentArray created
      }
    } while (object.lenth > 0);
    return contentArray;
  }


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

    // TODO: Handle 500 errors
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      // if (response.statusCode !== 200) {
      //   throw new Error(response.statusCode + ": " + JSON.stringify(response.body));
      // }
      console.log([response.statusCode, element.id]);
    });
  }

  function batchPublishContent(object) {
    var batchedObjectsCollection = groupObjectBy10s(object);

    async.eachLimit(batchedObjectsCollection, 1, function(collection, callback) {
        collection.forEach(postContentIds);
        console.log('Processing Collection #'+ count +' of '+ batchedObjectsCollection.length);
        ++count;
        setTimeout(callback, 2000);
    },
    function(err) {
        if( err ) {  // if any of the file processing produced an error, err would equal that error
          console.log('A file failed to process'); // All processing will now stop.
        } else {
          console.log('All files have been processed successfully');
        }
    });
  }

  batchPublishContent(jsonObj);
}

// var options = {
//   method: 'POST',
//   url: 'http://api.hubapi.com/content/api/v2/blog-posts/3788296356/publish-action',
//   qs: { access_token: 'd9c7e028-6cc6-4eb1-8997-59e7b0167993' },
//   headers:
//    { 'cache-control': 'no-cache',
//      'content-type': 'application/json' },
//   body: { action: 'schedule-publish' },
//   json: true };
//
// request(options, function (error, response, body) {
//   if (error) throw new Error(error);
//
//   console.log(body);
// });


module.exports = publishContentIds;
