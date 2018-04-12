var contentFilters = {
  noFilter: function() {
    return true;
  },
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
  },
  isCosArticle: function(arrayElement) {
    return arrayElement.post_body.indexOf("COS") !== -1;
  },
  containsContactSupport: function(arrayElement) {
    return arrayElement.post_body.toLowerCase().indexOf("contact support") !== -1;
  },
  isKnowledgeGuide: function(arrayElement) {
    return arrayElement.domain === "knowledge.hubspot.com";
  },
  hasSalesTemplateTopic: function(arrayElement) {
    return arrayElement.topic_ids.indexOf(4109410639) !== -1;
  },
  hasWorkflowTopic: function(arrayElement) {
    return arrayElement.topic_ids.indexOf(416756270) !== -1;
  },
  isReportingAddOnArticle: function(arrayElement) {
    return arrayElement.addon.indexOf("reporting") !== -1;
  },
  isNotDraft: function(arrayElement) {
    return arrayElement.is_draft === false;
  },
  isUserGuide: function(arrayElement) {
    return arrayElement.slug.indexOf("user-guide") !== -1;
  },
  isNotHiddenFile: function(file) {
    return file.indexOf(".") !== 0;
  },
  isSalesProOnly: function(arrayElement) {
    var pk = arrayElement.productKey;
    console.log(pk);
    if (pk) {
      if (pk.use_checkboxes) {
        if (
            // pk.sales_pro &&
            //  !pk.marketing_basic &&
            //  !pk.marketing_enterprise &&
            //  !pk.marketing_free &&
            //  !pk.marketing_pro &&
            //  !pk.marketing_starter &&
            //  !pk.partner_account &&
             pk.sales_free) {
          return true;
        }
      }
    }
    return false;
  }
};

module.exports = contentFilters;
