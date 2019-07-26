const fs = require('fs');
const rp = require("request-promise-native");
const config = require('../static/config.json');
const importsFolder = process.env.HOME + '/' + config.usersFolder + '/hub-batch/imports';
const limit = 300;
let offset = 0;

// Quiries
// (Fr) done
// (Fr-fr) done
// (Es) done
// (Es-la) done
// (De) done
// (De-de) done
// (Ja) done
// (Pt-br) done

module.exports = (function() {

  function getRequestV2(accessToken) {
    const file = fs.createWriteStream('ugs.csv');
    let getPostsOptions = {
      method: 'GET',
      url: 'https://api.hubapi.com/content/api/v2/pages',
      qs:
       {
         is_draft: false,
         limit: limit, // Maximum 300
         offset:  offset,
       },
      headers:
       {
         Authorization: `Bearer ${accessToken}`,
         'Content-Type': 'application/json'
       },
      json: true
    };

    function makeRequest(options) {
      return new Promise(resolve => {
        rp(options).then(body => {
          console.log(body);
          options.qs.offset += limit;
          resolve(body);
        } );
      });
    }

    function writeToFile(posts) {
      file.on('error', function(err) { console.log(err); });
      posts.objects.map(function(post) {
        let postInfo = [post.id, post.url];
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
  function makeGetRequestV2(token) {
    getRequestV2(token);
  }
  return { makeGetRequestV2: makeGetRequestV2 };
})();
