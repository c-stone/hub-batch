# Hub-Batch
###[![NPM](https://nodei.co/npm/hub-batch.png?downloads=true&stars=true)](https://nodei.co/npm/hub-batch/)

A library the utilizes HubSpot APIs for bulk updating COS content (Blog Posts and Site Pages). Hub-Batch allows you to:

1. __Export__ post/page information from HubSpot to a CSV file
2. __Import__ post/page information to HubSpot from a CSV file
3. __Update__ and __Publish__ live COS content
4. __Rollback__ changes 1 revision _just in case_

This tool has been used by HubSpot to bulk update content, with over 1000 pages updated at once.
![hub-batch UI](https://i.imgur.com/19d4hr3.png)

## Getting Started
### Prerequisite
This tool requires node.js. [You can install Node here](https://nodejs.org/en/).

### Installation
```
$ npm install -g hub-batch
```
### Static IDs Setup
This tool allows you to quickly filter your get requests by __blog groups__, __campaigns__, __topics__, __page name__ and/or __URL slug__. Since this information is unique to each HubSpot portal, you will need to populate the file `js/static/staticids.js` with your own IDs. Place any blog groups, campaigns or topics into that file, and they will automatically appear when using this tool.

Resources for finding each type of GUID:
- [List Blog Groups](http://developers.hubspot.com/docs/methods/blogv2/get_blogs)
- [List Topics](http://developers.hubspot.com/docs/methods/blog/v3/list-blog-topics)
- [Get Campaign GUID's within HubSpot](https://app.hubspot.com/l/campaigns/)

To find a campaign GUID, click on the campaign in app and the GUID will appear in the page's URL

After you complete these two steps, you are ready to begin.

## Usage
```
$ hub-batch
```
When you first run hub-batch in terminal, you will be asked to provide some authentication details. HubSpot’s APIs allow you to authenticate using a __HapiKey__ or __Access Token__. You will automatically asked to be add a new token if the existing token expires.

Next, you’ll be asked to select a folder for Hub-Batch to be placed. This is the folder where CSVs will be exported and where you can add CSV files to be imported.

After this set up is complete, run `$ hub-batch` again to begin.

### Example
From terminal, run:
```
$ hub-batch
```

Using the arrow keys, walk through the options provided:


![hub-batch UI](https://i.imgur.com/19d4hr3.png)

After selected your preferences, the CSV will be created:
![hub-batch sample IO](http://i.imgur.com/vwA2yNi.png)

## Documentation
This documentation covers the 4 main features: GET, UPDATE, PUBLISH, ROLLBACK

### GET
Use this option to create a CSV containing COS blog post/page data.

From terminal, run:
```
$ hub-batch
```

Using the arrow keys, select the following:
- Content type: Blog Posts or Site Pages

__For Blog Posts:__
- Operation type: GET
- Which blog would you like to access?: This allows you to export content from a specific blog in your portal
- Page State: Drafts, Published, Scheduled or All
- Optionally refine further by:
	- Campaign
	- Topic
	- Name
	- Slug

__For Site Pages:__
- Operation type: GET
- Export drafts as well as live pages: Y/N
- Optionally refine further by:
	- Campaign
	- Name
	- Slug

After selecting your options, hub-batch will create a CSV and place it in your exports folder.

The resulting CSV will contain that following information by default for each page/post exported:
- URL
- Post Body
- Meta Description
- Name
- ID
- Slug
- HubSpot Edit Link

And that's just the default. You can customize the tool to output whichever properties you'd like (even custom modules!). Once you have the CSV, open the file in Google Sheets (Excel mangles special characters) and make any changes you see fit to any of the properties. Find/Replace can be really handy. This has been very useful when rebrand or making any other bulk changes to live content.

### UPDATE
Use this option update the contents of COS blog post/page data. You will have the ability to select a CSV to import. [An example import file can be found here](https://gist.github.com/c-stone/5800dc3eeca6f11591453b52195536ce).

From terminal, run:
```
$ hub-batch
```

Using the arrow keys, select the following:

- Content type: Blog Posts or Site Pages
- Which file would you like to import?: This will list any CSV file found in the Hub-Batch __Imports__ folder.

After selecting the import file, Hub-Batch will begin updating each of the pages found in the CSV. __NOTE__ this will save the changes [in Buffer](http://developers.hubspot.com/docs/methods/pages/post_pages_page_id_publish_action), but will not push the changes live. To publish these changes, next use the PUBLISH option.

### PUBLISH
Use this option to Publish pages that have been updated or have unpublished changes.

From terminal, run:
```
$ hub-batch
```

Using the arrow keys, select the following:
- Content type: Blog Posts or Site Pages
- Which file would you like to import?: This will list any CSV file found in the Hub-Batch __Imports__ folder.

After selecting the import file, Hub-Batch will begin publishing each of the pages found in the CSV.

### ROLLBACK
Use this option to rollback published changes. This feature will revert any included pages 1 version.

From terminal, run:
```
$ hub-batch
```

Using the arrow keys, select the following options:
- Content type: Blog Posts or Site Pages
- Which file contains the content you'd like to rollback 1 version?: This will list any CSV file found in the Hub-Batch __Imports__ folder.
