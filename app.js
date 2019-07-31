#!/usr/bin/env node
let getUtils = require('./js/modules/getutils'),
  getUtilsV2 = require('./js/modules/getutilsv2'),
  getSlugsIDs = require('./js/modules/getSlugsIDs'),
  updateUtils = require('./js/modules/updateutils'),
  publishUtils = require('./js/modules/publishutils'),
  unpublishUtils = require('./js/modules/unpublishutils'),
  rollbackUtils = require('./js/modules/rollbackutils'),
  analyticsUtils = require('./js/modules/analyticsutils'),
  cliUtils = require('./js/modules/cliutils'),
  setup = require('./js/modules/setuputils'),
  config = require('./js/static/config.json');

// Hub Auth
require('dotenv').config();
const express = require('express');
const request = require('request-promise-native');
const NodeCache = require('node-cache');
const session = require('express-session');



// Hub Auth
const PORT = 3000;
const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
// Supports a list of scopes as a string delimited by ',' or ' ' or '%20'
const SCOPES = (process.env.SCOPE.split(/ |, ?|%20/) || ['contacts']).join(' ');

const REDIRECT_URI = `http://localhost:${PORT}/oauth-callback`;

const refreshTokenStore = {};
const accessTokenCache = new NodeCache({ deleteOnExpire: true });

const getPost = async (accessToken) => {
  console.log('Retrieving content from HubSpot using an access token');
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
    const result = await request.get('https://api.hubapi.com/content/api/v2/blog-posts', {
      headers: headers
    });

    return JSON.parse(result).objects[0];
  } catch (e) {
    console.error('  > Unable to retrieve post');
    return JSON.parse(e.response.body);
  }
};

const displayBlogTitle = (res, post) => {
  if (post.status === 'error') {
    res.write(`<p>Unable to retrieve post! Error Message: ${post.message}</p>`);
    return;
  }
  const { title, url } = post;
  res.write(`<p>Post title: ${title} ${url}</p>`);
};

// Use a session to keep track of client ID, while app is up
app.use(session({
  secret: Math.random().toString(36).substring(2),
  resave: false,
  saveUninitialized: true
}));

//================================//
//   Running the OAuth 2.0 Flow   //
//================================//

// Step 1
// Build the authorization URL to redirect a user
// to when they choose to install the app
const authUrl =
  'https://app.hubspot.com/oauth/authorize' +
  `?client_id=${encodeURIComponent(CLIENT_ID)}` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

// Redirect the user from the installation page to
// the authorization URL
app.get('/install', (req, res) => {
  console.log('Initiating OAuth 2.0 flow with HubSpot');
  console.log("Step 1: Redirecting user to HubSpot's OAuth 2.0 server");
  res.redirect(authUrl);
  console.log('Step 2: User is being prompted for consent by HubSpot');
});

// Step 2
// The user is prompted to give the app access to the requested resources

// Step 3
// Receive the authorization code from the OAuth 2.0 Server,
// and process it based on the query parameters that are passed
app.get('/oauth-callback', async (req, res) => {
  console.log('Step 3: Handling the request sent by the server');

  // Received a user authorization code, so now combine that with the other
  // required values and exchange both for an access token and a refresh token
  if (req.query.code) {
    console.log('  > Received an authorization token');

    const authCodeProof = {
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code: req.query.code
    };

    // Step 4
    // Exchange the authorization code for an access token and refresh token
    console.log('Step 4: Exchanging authorization code for an access token and refresh token');
    const token = await exchangeForTokens(req.sessionID, authCodeProof);
    if (token.message) {
      return res.redirect(`/error?msg=${token.message}`);
    }

    // Once the tokens have been retrieved, use them to make a query
    // to the HubSpot API
    res.redirect(`/`);
  }
});

//==========================================//
//   Exchanging Proof for an Access Token   //
//==========================================//

const exchangeForTokens = async (userId, exchangeProof) => {
  try {
    const responseBody = await request.post('https://api.hubapi.com/oauth/v1/token', {
      form: exchangeProof
    });
    // Usually, this token data should be persisted in a database and associated with
    // a user identity.
    const tokens = JSON.parse(responseBody);
    refreshTokenStore[userId] = tokens.refresh_token;
    accessTokenCache.set(userId, tokens.access_token, Math.round(tokens.expires_in * 0.75));

    console.log('  > Received an access token and refresh token');
    return tokens.access_token;
  } catch (e) {
    console.error(`  > Error exchanging ${exchangeProof.grant_type} for access token`);
    return JSON.parse(e.response.body);
  }
};

const refreshAccessToken = async (userId) => {
  const refreshTokenProof = {
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    refresh_token: refreshTokenStore[userId]
  };
  return await exchangeForTokens(userId, refreshTokenProof);
};

const getAccessToken = async (userId) => {
  if (!accessTokenCache.get(userId)) {
    console.log('Refreshing expired access token');
    await refreshAccessToken(userId);
  }
  return accessTokenCache.get(userId);
};

const isAuthorized = (userId) => {
  return refreshTokenStore[userId] ? true : false;
};

// Initialize app
app.get('/', async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  let userId = req.sessionID;
  if (isAuthorized(req.sessionID)) {
    const accessToken = await getAccessToken(req.sessionID);
    // HAVE ACCESS TOKEN HERE
    kickoffApp(accessToken, userId);

    // const post = await getPost(accessToken);
    res.write(`<h4>Success: return to hub-batch</h4>`);
  } else {
    res.write(`<h4>Authenticate here:</h4>`);
    res.write(`<a href="/install">Install</a>`);
  }
  res.end();
});

app.get('/error', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write(`<h4>Error: ${req.query.msg}</h4>`);
  res.end();
});

//  App start
function kickoffApp(token, userId) {
  if (isAuthorized(userId)) {
    cliUtils.getUserPreferences(token, function(answersObj) {
      var method = answersObj.method;
      if ( method === 'get' ) {
        getUtils.makeGetRequest(answersObj);
      }
      else if ( method === 'get2' ) {
        getUtilsV2.makeGetRequestV2(token);
      }
      else if ( method === 'getSlugsIDs' ) {
        getSlugsIDs.makeSlugToIDGetRequests(answersObj);
      }
      else if ( method === 'update' ) {
        updateUtils.makeUpdateRequest(answersObj, token);
      }
      else if ( method === 'publish' ) {
        publishUtils.makePublishRequest(answersObj);
      }
      else if ( method === 'unpublish' ) {
        unpublishUtils.makeUnpublishRequest(answersObj);
      }
      else if ( method === 'rollback' ) {
        rollbackUtils.makeRollbackRequest(answersObj);
      }
      else if ( method === 'analytics' ) {
        analyticsUtils.makeAnalyticsRequest(answersObj);
      }
    });
  } else {
    console.log("Your auth token is invalid or has expired. Please go to http://localhost:3000/install");
  }
}

app.listen(PORT, () => console.log(`Visit http://localhost:${PORT}/install to authenticate`));
cliUtils.showFiglet();
// kickoffApp();

