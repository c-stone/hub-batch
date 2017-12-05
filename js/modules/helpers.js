var cheerio = require('cheerio'),
    fs = require('fs'),
    moment = require('moment'),
    jquery = require('jquery'),
    contentFilters = require('../static/contentfilters');

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
  "getWordCount": function(text) {
    console.log(text.trim().replace(/(\r\n|\n|\r)/gm, ' ').split(' ').length);
    return text.trim().replace(/(\r\n|\n|\r)/gm, ' ').split(' ').length;
  }
};

module.exports = helpers;
