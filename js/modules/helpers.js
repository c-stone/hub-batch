var cheerio = require('cheerio'),
    fs = require('fs'),
    moment = require('moment'),
    jquery = require('jquery'),
    contentFilters = require('../static/contentfilters');
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const he = require("he");

var helpers = {
  getFolders: function(path) {
    var files = fs.readdirSync(path);
    var visibleFiles = files.filter(contentFilters.isNotHiddenFile);
    return visibleFiles;
  },
  //remove line ends from parsed HTML
  "removeLineEnds": function(htmlString) {
    if (htmlString) {
      return htmlString.replace(/\n/g, '');
    }
    else { console.log(htmlString); }
  },
  //remove sales article headings. They are set automatically in blog
  "removeHeading": function(bodyHtml) {
    if (bodyHtml) {
      $ = cheerio.load(jsonCleaner.removeLineEnds(bodyHtml), { decodeEntities: false });
      $('h2').remove();
      return $.html();
    }
    else { console.log(bodyHtml); }
  },
  "convertTimestamp": function(unixTimeStamp) {
    return moment(unixTimeStamp).format('MM/DD/YYYY');
  },
  "getWordCount": function(html, title) {
    const dom = new JSDOM(html);
    let d = dom.window.document;
    let parsedDoc = d.body.textContent.match(/\S+/g);
    let parsedTitle = title.match(/\S+/g);

    return parsedDoc.length + parsedTitle.length;
  },
  "getWordCountSrc": function(html) {
    const dom = new JSDOM(html);
    let d = dom.window.document;
    let parsedDoc = d.body.textContent.match(/\S+/g);
    return parsedDoc;
  }
};

module.exports = helpers;
