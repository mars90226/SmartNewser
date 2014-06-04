var config = require('./oauth');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new FacebookStrategy({
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  callbackURL: config.facebook.callbackURL
},
function(accessToken, refreshToken, profile, done) {
  User.findOne({ oauthID: profile.id }, function(err, user) {
    if (err) console.error(err);
    if (!err && user != null) {
      done(null, user);
    } else {
      var user = new User({
        oauthID: profile.id,
        name: profile.displayName,
        created: Date.now()
      });
      user.save(function(err) {
        if (err) {
          console.error(err);
        } else {
          console.log("saving user ...");
          done(null, user);
        }
      });
    }
  });
}));

passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user._id);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    console.log(user);
    if (!err) done(null, user);
    else done(err, null);
  });
});
