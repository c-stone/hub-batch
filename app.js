var request = require("request"),
    fs = require("fs");

// Access token for the portal you would like to get page/posts from
var accessToken = '',
    cosContentType = 'pages', // OR 'blog-posts'
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

function getContentIds() {
  var options = {
    method: 'GET',
    url: 'http://api.hubapi.com/content/api/v2/' + cosContentType,
    qs: queryString,
    headers: {'cache-control': 'no-cache'}
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var parsedBody = JSON.parse(body);
    console.log(parsedBody);
    var arrayOfAnalyticsIds = parsedBody.objects.map(function(object) {
        return  object.name + ";" + object.slug + ";" + object.analytics_page_id;
    });//Optional .filter();
    fs.appendFile('message4.csv', arrayOfAnalyticsIds, function (err) {
    });
      console.log(arrayOfAnalyticsIds);
  });
}

getContentIds();
