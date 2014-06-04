var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/facebook',
passport.authenticate('facebook'),
function(req, res) {
});

router.get('/facebook/callback',
passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/login'
}),
function(req, res) {
  res.redirect('/account');
});

module.exports = router;
