var cheerio = require('cheerio');

var jsonCleaner = {
  //remove the first portion of sales article slugs to match marketings blog slugs
  "stripSlug": function(slug){
    if (slug.indexOf('articles/kcs_article/') !== -1) {
      return slug.replace('articles/kcs_article/','');
    } else {
      return null;
    }
  },
  "stripSlugSpanish": function(slug){
    if (slug.indexOf('es/articles/kcs_article/') !== -1) {
      return slug.replace('es/articles/kcs_article/','');
    } else {
      return null;
    }
  },
  //remove line ends from parsed HTML
  "removeLineEnds": function(htmlString) {
    if (htmlString) {
      return htmlString.replace(/\n/g, '');
    } else { console.log(htmlString); }
  },
  //remove sales article headings. They are set automatically in blog
  "removeHeading": function(bodyHtml) {
    if (bodyHtml) {
      $ = cheerio.load(jsonCleaner.removeLineEnds(bodyHtml), { decodeEntities: false });
      $('h2').remove();
      return $.html();
    } else { console.log(bodyHtml); }
  }
};

module.exports = jsonCleaner;
