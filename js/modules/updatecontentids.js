var request = require("request"),
    async = require("async"),
    createBatches = require("./createbatches"),
    count = 1; // used for displaying which batch is being processed

function updateContentIds (jsonObj, cosContentType, queryString) {
  function putContentUpdates(element) {
    var options = {  // Construct request options and body
          method: 'PUT',
          url: 'http://api.hubapi.com/content/api/v2/'+ cosContentType +'/'+ element.id,
          qs: queryString,
          headers: {'cache-control': 'no-cache'},
          json: {
            // TODO: figure out what to do with Meta descirption and post body
            // meta_description: '',
            // post_body: '',
            // name: element.name, //From the csv import
            // topic_ids: [element.topicId],
            // slug: element.slug,
            // blog_author_id: 448510316, //Set directly
            // campaign: staticIds.campaignIds.leadinArticleMigration,
            // use_featured_image: false,
            publish_immediately: true,
            // widgets: {
            //   article_product_key: {
            //     body: {
            //       product: "HubSpot Sales & Marketing",
            //       marketing_subsc: "All subscriptions",
            //       sales_subsc: "All subscriptions",
            //       widget_name: "Article product key",
            //       in_beta: true,
            //       addon: ""
            //     }
            //   },
            //   product: {
            //     body: {
            //       value: "Marketing"
            //     }
            //   }
            //   in_app_project_url: {
            //     body: {
            //       value: element.inApp
            //     }
            //   }
            // }
          }
        };
    // Perform the request
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      if (response.statusCode !== 200) {
        throw new Error(response.statusCode + ": " + JSON.stringify(response.body));
      }
      console.log([response.statusCode, element.id]);
    });
  }

  function batchUpdateContent(object) {
    var batchedObjectsCollection = createBatches(object);

    async.eachLimit(batchedObjectsCollection, 1, function(collection, callback) {
        collection.forEach(putContentUpdates);
        console.log('Processing Collection #'+ count +' of '+ batchedObjectsCollection.length);
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
  batchUpdateContent(jsonObj);
}

module.exports = updateContentIds;
