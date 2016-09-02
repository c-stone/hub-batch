var fs = require("fs"),
    request = require("request"),
    json2csv = require('json2csv'),
    contentFilters = require('./contentfilters');


function getContentIds(accessToken, queryString, cosContentType) {
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

    var parsedBody = JSON.parse(body),
        cosContentJson = parsedBody.objects.map(function (object) {
          return  {
            name: '=hyperlink("'+ object.published_url +'", "' + object.name + '")',
            slug: object.slug,
            id: object.analytics_page_id,
            editLink: 'https://app.hubspot.com/content/[hubid]/edit-beta/' +
                      object.analytics_page_id,
            body: JSON.stringify(object.rss_body)
          };
        }), //.filter(contentFilters.isKnowledgeArticle()), //Optional .filter();
        fields = ['name', 'slug', 'id', 'editLink', 'body'],
        csv = json2csv({ data: cosContentJson, fields: fields });

    fs.writeFile('coscontentexport.json',
                 JSON.stringify(cosContentJson),
                 function (err) {
                   if (err) { return console.log(err); }
                   console.log("The JSON file was saved!");
                 });

    fs.writeFile('coscontentexport.csv', csv,
                function(err) {
                  if (err) throw err;
                  console.log('file saved');
                });
  });
}

module.exports = getContentIds;
