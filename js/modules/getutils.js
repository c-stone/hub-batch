var fs = require('fs'),
    request = require('request'),
    json2csv = require('json2csv'),
    jsonCleaner = require('../static/jsoncleanerutilities'),
    staticIds = require('../static/staticIds'),
    contentFilters = require('../static/contentfilters');

var getUtils = {
  makeGetRequest: function() {
    var answers = arguments[0]; // answers from users command line input
    var queryString = getUtils.buildGetQueryString(answers),
        cosContentType = answers[0].contentType,
        filter = contentFilters.noFilter;
    getUtils.fetchPageInfo(filter, cosContentType, queryString);
  },
  buildGetQueryString: function(answersObj) {
    var answers = answersObj[0];
    var qs = {};
    // console.log(answers);
    if (answers.method === 'get') {
      // All Get Requests
      qs.limit = 2500;
      if (process.env.AUTH_TYPE === "access_token") {
        qs.access_token = process.env.ACCESS_TOKEN_KB;
      }
      if (process.env.AUTH_TYPE === "hapikey") {
        qs.hapikey = process.env.ACCESS_TOKEN_KB;
      }
      if (answers.name) { qs.name__icontains = answers.name; }
      if (answers.slug) { qs.slug = answers.slug; }
      if (answers.campaign) { qs.campaign = staticIds.campaignIds[answers.campaign]; }
      if (answers.topic) { qs.topic = staticIds.topicIds[answers.topic]; }
      // Blog Post, GET query string
      if (answers.contentType === 'blog-posts') {
        qs.content_group_id = staticIds.groupIds[answers.contentGroupId];
        if (answers.postState !== 'ALL') { qs.state = answers.postState; }
      }
      // Pages, GET query string
      if (answers.contentType === 'pages') {
        qs.draft = answers.draft;
      }
    } else if (answers.method === 'update') {

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

module.exports = getUtils;
