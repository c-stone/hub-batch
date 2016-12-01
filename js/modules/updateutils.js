var request = require("request"),
    async = require("async"),
    createBatches = require("./createbatches"),
    count = 1; // used for displaying which batch is being processed


var updateUtils = {
  makeUpdateRequest: function(answersObj, jsonObject) {
    var cosContentType = answersObj.contentType;
    var queryString = updateUtils.buildUpdateQueryString(answersObj);
    var pageId = element.id;
    delete element.id; // save the Page ID then remove it from the object
  },
  buildUpdateQueryString: function(answersObj) {
    var answers = answersObj[0];
    var qs = {};
    if (process.env.AUTH_TYPE === "access_token") {
      qs.access_token = process.env.ACCESS_TOKEN_KB;
    }
    if (process.env.AUTH_TYPE === "hapikey") {
      qs.hapikey = process.env.ACCESS_TOKEN_KB;
    }
    return qs;
  },
  putContentUpdates: function(pageData) {
    // Format Request
    var options = {
      method: 'PUT',
      url: 'http://api.hubapi.com/content/api/v2/'+ cosContentType +'/'+ pageId,
      qs: queryString,
      headers: {'cache-control': 'no-cache'},
      json: pageData // IDEA: Get this directly from the CSV, no reason not to.
    };
    // Make Request
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      if (response.statusCode !== 200) {
        throw new Error(response.statusCode + ": " + JSON.stringify(response.body));
      }
      console.log([response.statusCode, element.id]);
    });
  },
  createBatches: function(pagesDataObject) {
    var batchArray = [];
    do { //populate batchArray with page content divided into 10s
      for (; pagesDataObject.length > 0;) {
        batchArray.push(pagesDataObject.splice(0, 3)); //batchArray created
      }
    } while (pagesDataObject.lenth > 0);
    return batchArray;
  },
  batchUpdateContent: function(pagesDataObject) {
    var batchedObjectsCollection = updateUtils.createBatches(pagesDataObject);

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
  },
  fetchCsvData: function(answersObj) {
    var csvFileName = answerObj.importFilename;
    csvConverter=new Converter({}); // new converter instance
    csvConverter.on('end_parsed', function(jsonObj) { // Converts csv to json object
      var pageId = jsonObj[0].id;
      delete jsonObj[0].id;
      console.log(pageId, jsonObj[0]);
      console.log(jsonObj[0].widgets);
    });
    fs.createReadStream(csvFileName).pipe(csvConverter); //read from file
  }
};

function makeUpdateRequest (jsonObj, cosContentType, queryString) {
  function putContentUpdates(element) {
    var pageId = element.id;
    delete element.id;
    console.log(element);

    var options = {  // Construct request options and body
          method: 'PUT',
          url: 'http://api.hubapi.com/content/api/v2/'+ cosContentType +'/'+ element.id,
          qs: queryString,
          headers: {'cache-control': 'no-cache'},
          json: {
            // TODO: figure out what to do with Meta descirption and post body
            // // IDEA: Get this directly from the CSV, no reason not to.
            // meta_description: '',
            // post_body: '',
            name: element.name, //From the csv import
            // topic_ids: [element.topicId],
            slug: element.slug,
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

module.exports = updateUtils;
