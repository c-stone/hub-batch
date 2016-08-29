var getContentIds = require("./js/modules/getContentIds");

// Access token for the portal you would like to get page/posts from
var accessToken = '39fe4a8b-8c34-4330-b404-adafee4bd346',
    cosContentType = 'blog-posts', // OR 'blog-posts'
    queryString = {
      access_token: accessToken,
      // Optional Parameters
      // limit: 3000,
      // offset: 0,
      // archived: false,
      // blog_author_id: 34623,
      // campaign: 3549384759,
      // content_group_id: 3345520891, // A specfic blog's *blog only*
      // created__gt: 4329847200000, // Supports exact, range, gt, gte, lt, lte
      // deleted_at__lt: 34572630000,
      // publish_date: 542376570000,
      // updated: 793847290000,
      // name__icontains: 'prospect', //Supports contains, icontains, ne
      // slug: 'sales/article/great-page-name', // Supports exact, in
      // subcategory: 'site_page', // OR landing_page
      // state: 'DRAFT'; // OR PUBLISHED, SCHEDULED *blog only*
    };

getContentIds(accessToken, queryString, cosContentType);
