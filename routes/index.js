var express = require('express');
var router = express.Router();
var async = require('async');
var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var Filter = mongoose.model('Filter');
var User = mongoose.model('User');
var article = require('../models/article');

/* GET home page. */
router.get('/', function(req, res) {
  async.series([
    function(callback) {
      var queryFilters = {};
      Filter.distinct('type', function(err, types) {
        if (err) console.error(err);
        Filter.find(function(err, filters) {
          if (err) console.error(err);
          for (var i in types) {
            var queries = req.query[types[i]] || [];
            if (typeof queries === 'string') {
              queries = [queries];
            }
            for (var j in queries) {
              var isFilter = false;
              for (var k in filters) {
                if (filters[k].content === queries[j] &&
                    filters[k].type === types[i]) {
                  isFilter = true;
                }
              }
              if (isFilter) {
                if (queryFilters[types[i]]) {
                  if (typeof queryFilters[types[i]] === 'string') {
                    queryFilters[types[i]] = [queryFilters[types[i]]]
                  }
                  queryFilters[types[i]].push(queries[j]);
                } else {
                  queryFilters[types[i]] = queries[j];
                }
              }
            }
          }
          callback(null, queryFilters);
        });
      });
    }], function(err, results){
      var queryFilters = results[0];
      //var query = Article.find().sort({'time': -1}).limit(20);
      article.select(queryFilters, function(err, articles) {
        if (err) console.error(err);
        var columns = [[], [], []];
        for (var i in articles) {
          columns[i % 3].push(articles[i]);
        }
        Filter.find(function(err, filters) {
          if (err) console.error(err);
          res.render('index', {
            columns: columns,
            builtinFilters: filters,
            filters: queryFilters,
            isLogin: req.isAuthenticated()
          });
        });
      });
    });
});

/* GET news list */
router.get('/list.json', function(req, res) {
  article.select(req.query, function(err, articles) {
    if (err) {
      console.error(err);
      res.json({error: err.name}, 500);
    }

    res.json(articles);
  });
});

router.get('/about', function(req, res) {
  res.render('about');
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/account', ensureAuthenticated, function(req, res) {
  User.findById(req.session.passport.user, function(err, user) {
    if (err) {
      console.error(err);
    } else {
      res.render('account', { user: req.user });
    }
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
