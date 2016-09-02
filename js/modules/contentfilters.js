var contentFilters = {
  isSpanishUrl: function(arrayElement) {
    return arrayElement.slug.indexOf("/es/") !== -1;
  },
  isNotSpanishUrl: function(arrayElement) {
    return arrayElement.slug.indexOf("/es/") !== -1;
  },
  isKnowledgeArticle: function(arrayElement) {
    return arrayElement.slug.indexOf("/articles/kcs_article/") !== -1;
  },
  isJapanese: function(arrayElement) {
    var regex = /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g;
    return regex.test(arrayElement.name);
  },
  isProspectsArticle: function(arrayElement) {
    return arrayElement.body.indexOf("prospect") !== -1;
  }
};

module.exports = contentFilters;
