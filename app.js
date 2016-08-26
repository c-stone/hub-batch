var fs = require("fs"),
    request = require("request"),
    json2csv = require('json2csv');

// Access token for the portal you would like to get page/posts from
var accessToken = '20897922-d738-41fc-9108-213a02f152da',
    cosContentType = 'blog-posts', // OR 'blog-posts'
    exportType = 'JSON', // OR 'CSV'
    queryString = {
      access_token: accessToken,
      // Optional Parameters
      limit: 3000,
      // offset: 0,
      // archived: false,
      // blog_author_id: 34623,
      // campaign: 3549384759,
      content_group_id: 3345520891, // A specfic blog's *blog only*
      // created__gt: 4329847200000, // Supports exact, range, gt, gte, lt, lte
      // deleted_at__lt: 34572630000,
      // publish_date: 542376570000,
      // updated: 793847290000,
      name__icontains: 'prospect', //Supports contains, icontains, ne
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

//Turn this into a function with arguments
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if (response.statusCode !== 200) {
      throw new Error(response.statusCode + ": " + response.body);
    }

    var parsedBody = JSON.parse(body);
    if (exportType === 'JSON') {
      var cosContentJson = parsedBody.objects.map(function(object) {
        return  {
          name: object.name,
          slug: object.slug,
          id: object.analytics_page_id
        };
      });//Optional .filter();

      var fields = ['name', 'slug', 'id'];
      var csv = json2csv({ data: cosContentJson, fields: fields });

      fs.writeFile('test-file.csv', csv, function(err) {
        if (err) throw err;
        console.log('file saved');
      });

      fs.writeFile('message6.json', JSON.stringify(cosContentJson),
        function (err) {
          if(err) {
            return console.log(err);
          }
          console.log("The JSON file was saved!");
        });
    } else if (exportType === 'CSV') {
      var cosContentCsv = parsedBody.objects.map(function(object) {
        return  object.name + ',' + object.slug + ',' + object.analytics_page_id + '\n';
      });//Optional .filter();

      fs.writeFile('message9.csv', JSON.stringify(cosContentCsv), function (err) {
        if(err) {
          return console.log(err);
        }
        console.log("The CSV file was saved!");
      });
      console.log(cosContentCsv);
    }
  });
}

getContentIds(exportType);
