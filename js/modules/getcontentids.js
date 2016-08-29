var fs = require("fs"),
    request = require("request"),
    json2csv = require('json2csv');

function getContentIds(accessToken, queryString, cosContentType, exportType) {
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

    var parsedBody = JSON.parse(body),
        cosContentJson = parsedBody.objects.map(function (object) {
          return  {
            name: object.name,
            editLink: 'https://app.hubspot.com/l/content/edit-beta/' +
                      object.analytics_page_id,
            id: object.analytics_page_id
          };
        }), //Optional .filter();
        fields = ['name', 'edit link', 'id'],
        csv = json2csv({ data: cosContentJson, fields: fields });

    fs.writeFile('coscontentexport.csv', csv,
                 function(err) {
                   if (err) throw err;
                   console.log('file saved');
                 });

    fs.writeFile('coscontentexport.json',
                 JSON.stringify(cosContentJson),
                 function (err) {
                   if (err) { return console.log(err); }
                   console.log("The JSON file was saved!");
                 });
  });
}
