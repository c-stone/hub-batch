#Hub-Batch
A command line utility for gathering, editing and updating HubSpot COS blog posts and pages. This tool will
prompt you with a series of options, for example:
- Would you like to GET, UPDATE or PUBLISH COS Content?
- Are you working with Blog Posts or Site Pages?
- You will be given options to refine your GET request or to select a CSV file to be used to UDATE/PUBLISH your content.

A GET request will return your page data in CSV and JSON formats into the folder labeled EXPORTS. More on the page information
returned later...

You can UPDATE or PUBLISH content using CSV files as well. A correctly formatted CSV should be
placed in the IMPORTS folder. When performing an UPDATE or PUBLISH request, you will be able to select any
from that folder. More on CSV formatting later..

Information about about the APIs used can be found on HubSpot developer documentation for [blog posts](http://developers.hubspot.com/docs/methods/blogv2/get_blog_posts) and [site pages](http://developers.hubspot.com/docs/methods/pages/get_pages).

### Getting Started
Clone this project and save it on your machine. We will need to customize a couple of files to begin.

**Authentication**
In order to make requests over the API, we will need to supply one form of authentication. You can use either and access_token
or a hapikey. Place your specific authentication credentials in the file labeled sample.env. Follow the instructions within that
file.

Once your .env file is saved, you are ready to move on.

**Static IDs**
This tool allows you to quickly filter your get requests by blog groups, campaigns, or topics. Since this information is unique to each HubSpot portal, you will need to populate the file `js/static/staticids.js` with your own IDs. Place any blog groups, campaigns or topics into that file, and they will automatically appear when using this tool.

Resources for finding each type of GUID:
[List Blog Groups](http://developers.hubspot.com/docs/methods/blogv2/get_blogs)
[List Topics](http://developers.hubspot.com/docs/methods/blog/v3/list-blog-topics)
[Get Campaign GUID's within HubSpot](https://app.hubspot.com/l/campaigns/)
To find a campaign GUID, click on the campaign in app and the GUID will appear in the page's URL

After you complete these two steps, you are ready to begin.

### Usage

To start the application, open a terminal window and navigate to this project's folder. Next, run `./app.js`
This will initiate a series of questions to build your request.

![hub-batch sample image](https://i.imgur.com/19d4hr3.png)

- First you will be asked if you are working with Blog Post or Site pages
- Next, you will select the type of request you would like to make


### Request Types
**GET**
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

The CSV and JSON files will appear in the EXPORT folder in this project's directory.
You can edit the CSV in Excel, making use of find/replace to edit content in bulk. You
will then have the ability to use this CSV to update all of the pages within.

**UPDATE**
To update pages in HubSpot, place a properly formatted CSV file in the IMPORTS folder.
An example of a properly formatted CSV is provided. All CSV files returned by this tool
will also be in the correct format. If you make edits to a file in the EXPORTS folder, move
it into the IMPORTS folder once you are ready to update the pages. The CSV file *MUST* contain the
ID field, at least. Any other fields are optional.

Select the UPDATE option within Hub-Batch. You will then be asked to select a CSV file and then
tool will begin updating the pages. The updates are saved in "[Buffer](http://developers.hubspot.com/docs/methods/blogv2/get_blog_posts_blog_post_id_buffer)". You
can see the updates within your HubSpot portal, by editing any of the updated pages. You will need to
use the publish portion of this tool to push your changes live.

**PUBLISH**
When selecting the PUBLISH action, you will be prompted to select a file, just like with the UPDATE action.
Select the file that contains the pages you would like to publish.
