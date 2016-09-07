# Migration Utilities
A collection of scripts for gathering, editing and updating HubSpot COS blog posts and pages.
## getContentIds
This script is used, make a GET request to either the HubSpot blog-posts API or site pages API and export both a CSV and JSON file into the Exports folder.


as well as some optional queryStrings found on HubSpot developer documentation for [blog posts](http://developers.hubspot.com/docs/methods/blogv2/get_blog_posts) and [site pages](http://developers.hubspot.com/docs/methods/pages/get_pages).


### Usage

Clone the project and run:
  ~> node app.js

Within app.js:
- you must add a valid access token for the portal you would like to make a request to
- you can chose to export blog-posts or pages
- you can customize the query parameters you would like enabled.
- you can apply a pre-created filter using one of the functions found in `/js/modules/contentFilters.js`
