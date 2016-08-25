var request = require("request"),
    fs = require("fs");

// Access token for the portal you would like to get page/posts from
var accessToken = '2b7836c2-2862-4ac8-b3e8-bf0d1eea8ba5',
    cosContentType = 'pages', // OR 'blog-posts'
    exportType = 'JSON', // OR 'CSV'
    queryString = {
      access_token: accessToken,
      // Optional Parameters
      // limit: 20,
      // offset: 0,
      // archived: false,
      // blog_author_id: 34623,
      // campaign: 3549384759,
      // content_group_id: 8743928374, // A specfic blog's *blog only*
      // created__gt: 4329847200000, // Supports exact, range, gt, gte, lt, lte
      // deleted_at__lt: 34572630000,
      // publish_date: 542376570000,
      // updated: 793847290000,
      // name__contains: 'Great Page Name', //Supports contains, icontains, ne
      // slug: 'sales/article/great-page-name', // Supports exact, in
      // subcategory: 'site_page', // OR landing_page
      // state: 'DRAFT'; // OR PUBLISHED, SCHEDULED *blog only*
    };

function getContentIds(exportType) {
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
    if (exportType === 'JSON' || 'json') {
      var cosContentJson = parsedBody.objects.map(function(object) {
        return  {
          name: object.name,
          slug: object.slug,
          id: object.analytics_page_id
        };
      });//Optional .filter();
      fs.appendFile('message6.json', JSON.stringify(cosContentJson), function (err) {
        if(err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      });
      console.log(cosContentJson);
    } else if (exportType === 'CSV' || 'csv') {
      var cosContentCsv = parsedBody.objects.map(function(object) {
        return  object.name, object.slug, object.analytics_page_id;
      });//Optional .filter();
      fs.appendFile('message6.csv', JSON.stringify(cosContentCsv), function (err) {
        if(err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      });
      console.log(cosContentCsv);
    }
  });
}

getContentIds(exportType);
