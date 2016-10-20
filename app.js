require('dotenv').config(); //Set up local enviroment, for authentication

var getContentIds = require("./js/modules/getcontentids"),
    updateContentIds = require("./js/modules/updatecontentids"),
    publishContentIds = require("./js/modules/publishContentIds"),
    contentFilters = require('./js/modules/contentfilters'),
    staticIds = require("./js/modules/staticids"),
    fs = require("fs"),
    Converter = require("csvtojson").Converter;

// Import CSV File here
var csvFileName = "./imports/japanese-quick-answers.csv";

var appAction = proccess.argv[2], // 'get' OR 'update' OR 'publish' from CLI
    accessToken = process.env.ACCESS_TOKEN, // from local .env file
    cosContentType = 'blog-posts', // 'pages' OR 'blog-posts'
    filter = contentFilters.noFilter, // MUST use 'noFilter' as default
    queryString = {
      access_token: accessToken,
      // Optional Parameters for Getting Content
      // limit: 1000,
      // offset: 0,
      // archived: false,
      // blog_author_id: 34623,
      // campaign: staticIds.campaignIds.spanishSalesArticleMigration,
      // content_group_id: staticIds.groupId.academyCustomerProjects, // A specfic blog's *blog only*
      // created__gt: 4329847200000, // Supports exact, range, gt, gte, lt, lte
      // deleted_at__lt: 34572630000,
      // publish_date: 542376570000,
      // updated: 793847290000
      // name__icontains: 'reporting add-on', //Supports contains, icontains, ne
      // slug: 'sales/article/great-page-name', // Supports exact, in
      // subcategory: 'site_page', // OR landing_page
      // state: 'PUBLISHED' // OR PUBLISHED, SCHEDULED *blog only*
    };

if (appAction === 'get') { // Used for getting page/post data
  console.log('Getting...');
  getContentIds(filter, cosContentType, queryString); // Returns a CSV file in the exports folder

} else if (appAction === 'update' || 'publish') { // Used for updating pages/posts
  csvConverter=new Converter({}); // new converter instance
  csvConverter.on('end_parsed', function(jsonObj) { // Converts csv to json object
      if (appAction === 'update') {
        console.log('Updating...');
        updateContentIds(jsonObj, cosContentType, queryString);
      } else if (appAction === 'publish') {
        console.log("Publishing...");
        publishContentIds(jsonObj, cosContentType, queryString);
      }
  });
  fs.createReadStream(csvFileName).pipe(csvConverter); //read from file

} else {
  console.warn("variable 'appAction' must be either 'get', 'update' or 'publish'");
}
