#Hub-Batch
###[![NPM](https://nodei.co/npm/hub-batch.png?downloads=true&stars=true)](https://nodei.co/npm/hub-batch/)

This tool allows anyone to easily export their COS blog posts, or site pages using our public APIs into a CSV format. You can refine the pages or posts exported with a few different criteria: campaign, blog groups, topic, name, slug and more. The resulting CSV will contain that following information by default for each page/post exported:
- URL
- Post Body
- Meta Description
- Name
- ID
- Slug
- HubSpot Edit Link

And that's just the default. You can customize the tool to output whichever properties you'd like (even custom modules!). Once you have the CSV, pop open Excel and make whichever changes you see fit to any of the properties. Find/Replace can be really handy when going through a rebrand for example. After you've finished making bulk changes in the CSV, you can select the file within Hub-Batch to update and publish all of the changes, like magic.

Information about about the APIs used can be found on HubSpot developer documentation for [blog posts](http://developers.hubspot.com/docs/methods/blogv2/get_blog_posts) and [site pages](http://developers.hubspot.com/docs/methods/pages/get_pages).

## Getting Started
### Prerequisite
This tool requires node.js. [You can install Node here](https://nodejs.org/en/).

### Installation
`npm install -g hub-batch`

### Authentication
In order to make requests over the API, we will need to supply one form of authentication. You can use either an `access_token`
or a `hapikey`. Place your specific authentication credentials in the file labeled sample.env. Follow the instructions within that
file. You will need to rename this file `.env` (remove 'sample').

Once your .env file is saved, you are ready to move on.

### Static IDs
This tool allows you to quickly filter your get requests by __blog groups__, __campaigns__, __topics__, __page name__ and/or __URL slug___. Since this information is unique to each HubSpot portal, you will need to populate the file `js/static/staticids.js` with your own IDs. Place any blog groups, campaigns or topics into that file, and they will automatically appear when using this tool.

Resources for finding each type of GUID:
[List Blog Groups](http://developers.hubspot.com/docs/methods/blogv2/get_blogs)
[List Topics](http://developers.hubspot.com/docs/methods/blog/v3/list-blog-topics)
[Get Campaign GUID's within HubSpot](https://app.hubspot.com/l/campaigns/)
To find a campaign GUID, click on the campaign in app and the GUID will appear in the page's URL

After you complete these two steps, you are ready to begin.

## Usage

To start the application, open a terminal window and run
`$ hub-batch`

![hub-batch sample image](https://i.imgur.com/19d4hr3.png)

- First you will be asked if you are working with Blog Post or Site pages
- Next, you will select the type of request you would like to make:
  - __GET__: return a CSV and JSON file with page data information
  - __UPDATE__: Intakes a CSV and saves the changes [in buffer](http://developers.hubspot.com/docs/methods/blogv2/get_blog_posts_blog_post_id_buffer)
  - __PUBLISH__: Takes the changes saved in buffer and pushes them live


## Request Types
### GET
This action returns a CSV and JSON file containing the follow page/blog-post data by default:
- URL
- The HTML body of the post or page
- Meta Description
- Name
- Page ID
- Slug
- Edit Link

You will be given the option to refine the GET request by the following criteria:

For Blog Posts:
- Which blog? (if your portal has multiple blogs)
- Page in which state? Published, Drafts, Archived or All
- By Campaign
- By Topic
- By the post's Name
- By the post's URL slug

For Site Pages:
- Export Drafts too?
- By Campaign
- By Topic
- By the post's Name
- By the post's URL slug

The CSV and JSON files will appear in the ___EXPORTS___ folder in this project's directory.

### UPDATE
To update pages in HubSpot, place a properly formatted CSV file in the __IMPORTS__ folder.
An example of a properly formatted CSV is provided (__coscontentexport-sample.csv__). All CSV files returned by this tool
will also be in the correct format. If you make edits to a file in the __EXPORTS__ folder, move
it into the __IMPORTS__ folder once you are ready to update the pages. The CSV file _MUST_ contain the
ID field, at least. Any other fields are optional.

Select the UPDATE option within Hub-Batch. You will then be asked to select a CSV file and the
tool will begin updating the pages. The updates are saved in "[Buffer](http://developers.hubspot.com/docs/methods/blogv2/get_blog_posts_blog_post_id_buffer)". You
can see the updates within your HubSpot portal, by editing any of the updated pages. You will need to
use the publish portion of this tool to push your changes live.

### PUBLISH
When selecting the PUBLISH action, you will be prompted to select a file, just like with the UPDATE action.
Select the file that contains the pages you would like to publish.
