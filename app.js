var getContentIds = require("./js/modules/getcontentids"),
    contentFilters = require('./js/modules/contentfilters'),
    staticIds = require("./js/modules/staticids");
// Import CSV File here
var csvFileName = "../../imports/spanish-url-list-done.csv";

// Access token for the portal you would like to get page/posts from
var accessToken = '053451d5-3fa2-43a4-9d3e-52bfbbe5459a',
    cosContentType = 'blog-posts', // 'pages' OR 'blog-posts'
    filter = contentFilters.noFilter, // MUST use 'noFilter' as default
    queryString = {
      access_token: accessToken,
      // Optional Parameters
      // limit: 3000,
      // offset: 0,
      // archived: false,
      // blog_author_id: 34623,
      // campaign: staticIds.campaignIds.forms,
      // content_group_id: staticIds.groupId.quickAnswerBlog, // A specfic blog's *blog only*
      // created__gt: 4329847200000, // Supports exact, range, gt, gte, lt, lte
      // deleted_at__lt: 34572630000,
      // publish_date: 542376570000,
      // updated: 793847290000
      // name__icontains: 'templates', //Supports contains, icontains, ne
      // slug: 'sales/article/great-page-name', // Supports exact, in
      // subcategory: 'site_page', // OR landing_page
      // state: 'PUBLISHED' // OR PUBLISHED, SCHEDULED *blog only*
    };

// Body for PUT Requests
var body = {
      campaign: 45354354365765,
      publish_immediately: true,

    };

//Returns a CSV file in the exports folder
getContentIds(queryString, cosContentType, filter);

// publishContentIds(acccesToken, )
