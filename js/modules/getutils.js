var fs = require('fs'),
    request = require('request'),
    json2csv = require('json2csv'),
    jsonCleaner = require('../static/jsoncleanerutilities'),
    staticIds = require('../static/staticIds'),
    contentFilters = require('../static/contentfilters');

var getUtils = {
  makeGetRequest: function(answersObj) {
    // var answersObj = arguments[0]; // answersObj from users command line input
    var queryString = getUtils.buildGetQueryString(answersObj),
        cosContentType = answersObj.contentType,
        filter = contentFilters.noFilter;
    getUtils.fetchPageInfo(filter, cosContentType, queryString);
  },
  buildGetQueryString: function(answersObj) {
    var qs = {};
    // console.log(answersObj);
    if (answersObj.method === 'get') {
      // All Get Requests
      qs.limit = 2500;
      if (process.env.AUTH_TYPE === "access_token") {
        qs.access_token = process.env.ACCESS_TOKEN_KB;
      }
      if (process.env.AUTH_TYPE === "hapikey") {
        qs.hapikey = process.env.ACCESS_TOKEN_KB;
      }
      if (answersObj.name) { qs.name__icontains = answersObj.name; }
      if (answersObj.slug) { qs.slug = answersObj.slug; }
      if (answersObj.campaign) { qs.campaign = staticIds.campaignIds[answersObj.campaign]; }
      if (answersObj.topic) { qs.topic = staticIds.topicIds[answersObj.topic]; }
      // Blog Post, GET query string
      if (answersObj.contentType === 'blog-posts') {
        qs.content_group_id = staticIds.groupIds[answersObj.contentGroupId];
        if (answersObj.postState !== 'ALL') { qs.state = answersObj.postState; }
      }
      // Pages, GET query string
      if (answersObj.contentType === 'pages') {
        qs.draft = answersObj.draft;
      }
    } else if (answersObj.method === 'update') {

    }
    console.log("query string: " + JSON.stringify(qs));
    return qs;
  },
  fetchPageInfo: function(filter, cosContentType, queryString) {
    var options = {
      method: 'GET',
      url: 'http://api.hubapi.com/content/api/v2/' + cosContentType,
      qs: queryString,
      headers: {'cache-control': 'no-cache'}
    };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      if (response.statusCode !== 200) {
        throw new Error(response.statusCode + ": " + response.body);
      }
      var parsedBody = JSON.parse(body);
      var portalId = parsedBody.objects[0].portal_id,
          cosContentJson = parsedBody.objects.map(function (object) {
            var csvProperties =
            { // DEFAULT
              url: object.url,
              post_body: jsonCleaner.removeLineEnds(object.post_body),
              meta_description: object.meta_description,
              name: object.name,
              id: object.id,
              slug: object.slug,
              editLink: 'https://app.hubspot.com/content/'+ process.env.HUB_ID +
                        '/edit-beta/' + object.id,
              // CUSTOM //TODO: make this more customizable
              // inApp: object.widgets.in_app_project_url.body.value,
              // inAcademy: object.widgets.project_url.body.value
              // addon: object.widgets.article_product_key.body.addon,
              // topic_ids: object.topic_ids
            };
            return csvProperties;
          }).filter(filter), //Optional .filter();

          fields = Object.keys(cosContentJson[0]), // fields returned in the csv
          csv = json2csv({ data: cosContentJson, fields: fields });
      // Creates JSON file
      fs.writeFile('./exports/coscontentexport-' + portalId + '.json',
         JSON.stringify(cosContentJson),
         function (err) {
           if (err) { return console.log("error: " + err); }
           console.log("The JSON file was saved!");
         });
      // Creates CSV file
      fs.writeFile('./exports/coscontentexport-' + portalId + '.csv', csv,
        function(err) {
          if (err) throw err;
          console.log('The CSV file was saved');
        });
    });
  }
};


var getUtils = (function() {
  var file = 0;
  function buildGetQueryString() {
    file = 5;
  }

  function thing() {
    buildGetQueryString();
  }

  return {
    buildGetQueryString: buildGetQueryString,
  };
})();

module.exports = getUtils;
