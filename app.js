var getContentIds = require("./js/modules/getcontentids"),
    contentFilters = require('./js/modules/contentfilters'),
    staticIds = require("./js/modules/staticids");

// Access token for the portal you would like to get page/posts from
var accessToken = 'b4c2299d-e771-47a1-83f3-86fbef6dcc46',
    cosContentType = 'pages', // 'pages' OR 'blog-posts'
    filter = contentFilters.noFilter, // MUST use 'noFilter' as default
    queryString = {
      access_token: accessToken,
      // Optional Parameters
      limit: 5000,
      // offset: 0,
      // archived: false,
      // blog_author_id: 34623,
      // campaign: staticIds.campaignIds.forms,
      // content_group_id: staticIds.groupId.leadinBlog, // A specfic blog's *blog only*
      // created__gt: 4329847200000, // Supports exact, range, gt, gte, lt, lte
      // deleted_at__lt: 34572630000,
      // publish_date: 542376570000,
      // updated: 793847290000
      name__icontains: 'prospect', //Supports contains, icontains, ne
      // slug: 'sales/article/great-page-name', // Supports exact, in
      // subcategory: 'site_page', // OR landing_page
      // state: 'PUBLISHED' // OR PUBLISHED, SCHEDULED *blog only*
    };

getContentIds(accessToken, queryString, cosContentType, filter);



// create an exports folder
// move and rename app.js
