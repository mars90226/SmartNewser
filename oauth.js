var ids = {
  facebook: {
    clientID: '1492379880992323',
    clientSecret: '9f8e1e8a63b77992e11014f02a453d54',
    callbackURL: process.env.FACEBOOK_OAUTH_CALLBACK || 'http://localhost:3000/auth/facebook/callback'
  }
};

module.exports = ids;
