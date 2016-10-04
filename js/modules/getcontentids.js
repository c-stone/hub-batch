var fs = require("fs"),
    request = require("request"),
    json2csv = require('json2csv');


function getContentIds(queryString, cosContentType, filter) {
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
        portalId = parsedBody.objects[0].portal_id,
        cosContentJson = parsedBody.objects.map(function (object) {
          console.log(object.widgets.article_product_key);
          return  {
            name: object.name,
            // url: object.url,
            // slug: object.slug,
            // id: object.analytics_page_id,
            // addon: object.widgets.article_product_key.body.addon,
            editLink: 'https://app.hubspot.com/content/'+ portalId +'/edit-beta/' +
                      object.analytics_page_id
          };
        }).filter(filter), //Optional .filter();
        fields = ['name', 'addon', 'editLink'],
        csv = json2csv({ data: cosContentJson, fields: fields });

    fs.writeFile('./exports/coscontentexport-' + portalId + '.json',
                 JSON.stringify(cosContentJson),
                 function (err) {
                   if (err) { return console.log(err); }
                   console.log("The JSON file was saved!");
                 });

    fs.writeFile('./exports/coscontentexport-' + portalId + '.csv', csv,
                function(err) {
                  if (err) throw err;
                  console.log('The CSV file was saved');
                });
  });
}

module.exports = getContentIds;
