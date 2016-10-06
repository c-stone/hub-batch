var fs = require("fs"),
    request = require("request"),
    Converter = require("csvtojson").Converter,
    csvFileName = "./imports/spanish-url-list-done.csv"; // IMPORT CSV HERE

function updateContentIds(cosContentType, queryString) {
  csvConverter=new Converter({}); //new converter instance

  function putContentUpdates(element) {
    console.log(element.id);
    // Using cosContentType & queryString from Global Scope
    var options = {   // Construct request options and body
          method: 'PUT',
          url: 'http://api.hubapi.com/content/api/v2/'+ cosContentType +'/'+ element.id,
          qs: queryString,
          headers: {'cache-control': 'no-cache'},
          body: {
            // TODO: figure out what to do with Meta descirption and post body
            meta_description: '',
            post_body: '',
            name: element.name, //From the csv import
            topic_ids: [element.topicId],
            slug: element.slug,
            blog_author_id: 448510316, //Set directly
            campaign: staticIds.campaignIds.leadinArticleMigration,
            use_featured_image: false,
            widgets: {
              article_product_key: {
                body: {
                  product: "HubSpot Sales & Marketing",
                  marketing_subsc: "All subscriptions",
                  sales_subsc: "All subscriptions",
                  widget_name: "Article product key",
                  in_beta: true,
                  addon: ""
                }
              },
              product: {
                body: {
                  value: "Marketing"
                }
              }
            }
          }
        };
    // Construct the request
    // request(options, function (error, response, body) {
    //   if (error) throw new Error(error);
    //   if (response.statusCode !== 200) {
    //     throw new Error(response.statusCode + ": " + response.body);
    //   }
    //   console.log([response.statusCode, element.id]);
    // });
  }

  //end_parsed will be emitted once parsing finished
  csvConverter.on("end_parsed", function(jsonObj) {
      jsonObj.forEach(updateContentIds);
  });

  //read from file
  fs.createReadStream(csvFileName).pipe(csvConverter);
}


module.exports = updateContentIds;
