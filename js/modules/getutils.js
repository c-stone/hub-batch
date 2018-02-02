var fs = require('fs'),
    request = require('request'),
    json2csv = require('json2csv'),
    helpers = require('./helpers'),
    staticIds = require('../static/staticIds'),
    config = require('../static/config'),
    contentFilters = require('../static/contentfilters');


module.exports = (function() {
  function makeGetRequest(answersObj) {
    var queryString = buildGetQueryString(answersObj),
        cosContentType = answersObj.contentType,
        filter = contentFilters.noFilter;
    fetchPageInfo(filter, cosContentType, queryString);
  }

  function buildGetQueryString(answersObj) {
    var qs = {};
    // All Get Requests
    qs.limit = 2500;
    // qs.order = "-updated"; //reverse for endpoint limits
    if (process.env.AUTH_TYPE === "access_token") {
      qs.access_token = process.env.AUTH_TOKEN;
    }
    if (process.env.AUTH_TYPE === "hapikey") {
      qs.hapikey = process.env.AUTH_TOKEN;
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
    return qs;
  }

  function fetchPageInfo(filter, cosContentType, queryString) {
    var options = {
      method: 'GET',
      url: 'http://api.hubapi.com/content/api/v2/' + cosContentType,
      qs: queryString,
      headers: {'cache-control': 'no-cache'}
    };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      if (response.statusCode !== 200)
      {
        throw new Error(response.statusCode + ": " + response.body);
      }
      // Build CSV and JSON from Body of response
      var parsedContentData = JSON.parse(body),
          csvContent = parsedContentData.objects.map(function (object) {
            var csvProperties =
            { // DEFAULT
              url: object.url,
              // featured_image: object.featured_image,
              post_body: helpers.removeLineEnds(object.post_body),
              meta_description: object.meta_description,
              name: object.name,
              // use_featured_image: object.use_featured_image,
              // id: object.id,
              // slug: object.slug,
              //editLink: 'https://app.hubspot.com/content/'+ process.env.HUB_ID +
                       // '/edit-beta/' + object.id,
              // CUSTOM //TODO: make this more customizable
              // inApp: object.widgets.in_app_project_url.body.value,
              // inAcademy: object.widgets.project_url.body.value
              // addon: object.widgets.article_product_key.body.addon,
              // topic_ids: object.topic_ids
            };
            return csvProperties;
          });//.filter(filter);
      var csvHeaders = Object.keys(csvContent[0]),// headers returned in the csv
          completeCSV = json2csv({ data: csvContent, fields: csvHeaders }),
          cosContentJSON = JSON.stringify(csvContent),
          portalId = parsedContentData.objects[0].portal_id,
          exportsFolder = process.env.HOME+ '/'+ config.usersFolder+ '/hub-batch/exports'; //ID used in output file title
      // Creates JSON file
      fs.writeFile(exportsFolder+ '/coscontentexport-'+ portalId+ '.json', cosContentJSON,
        function (err) {
         if (err) { return console.log("error: "+ err); }
         console.log("The JSON file was saved!");
        }
      );
      // Creates CSV file
      fs.writeFile(exportsFolder+ '/coscontentexport-'+ portalId+ '.csv', completeCSV,
        function(err) {
          if (err) throw err;
          console.log('The CSV file was saved');
        }
      );
    });
  }
  return {
    makeGetRequest: makeGetRequest
  };
})();
