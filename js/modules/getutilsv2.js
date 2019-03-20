const rp = require("request-promise-native");
const fs = require('fs');
const importsFolder = process.env.HOME + '/' + config.usersFolder + '/hub-batch/imports';
const limit = 300;
let offset = 0;

module.exports = (function() {
  function getRequestV2() {
    const file = fs.createWriteStream('array-en-full.csv');
    let getPostsOptions = {
      method: 'GET',
      url: 'https://api.hubapi.com/content/api/v2/blog-posts',
      qs:
       { access_token: process.env.AUTH_TOKEN,
         state: 'PUBLISHED',
         limit: limit, // Maximum 300
         offset:  offset,
         content_group_id: 3345520891, // EN KB Articles
       },
      headers:
       { 'cache-control': 'no-cache' },
      json: true
    };

    function makeRequest(options) {
      return new Promise(resolve => {
        rp(options).then(body => {
          options.qs.offset += limit;
          resolve(body);
        } );
      });
    }

    function writeToFile(posts) {
      file.on('error', function(err) { console.log(err); });
      posts.objects.map(function(post) {
        let postInfo = [post.id, post.url, post.name];
        file.write(postInfo.join('    ') + '\n');
      });
    }

    async function asyncCall() {
      console.log('calling');
      for (let i = 0; i < 3 ; i++) {
        console.log(i);
        let posts = await makeRequest(getPostsOptions);
        writeToFile(posts);
      }
    }

    asyncCall().then(() => file.end())
  }
  //
  //
  function makeGetRequestV2() {
    getRequestV2();
  }
  return { makeGetRequestV2: makeGetRequestV2 };
})();
