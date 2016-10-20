var fs = require("fs"),
    request = require("request"),
    json2csv = require('json2csv');

function getContentIds(filter, cosContentType, queryString) {
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
          return  { //TODO add body + meta descirption
            // DEFAULT
            name: object.name,
            slug: object.slug,
            editLink: 'https://app.hubspot.com/content/'+ portalId +
                      '/edit-beta/' + object.analytics_page_id,
            id: object.analytics_page_id
            // CUSTOM //TODO: make this more customizable
            // inApp: object.widgets.in_app_project_url.body.value,
            // inAcademy: object.widgets.project_url.body.value
            // addon: object.widgets.article_product_key.body.addon,
          };
        }).filter(filter), //Optional .filter();
        fields = ['name', 'slug', 'editLink', 'id'],
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
