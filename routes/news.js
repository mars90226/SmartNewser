var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var Filter = mongoose.model('Filter');

function getArticle(id, next, callback) {
  Article.find({ _id: id }, function(err, articles) {
    if (err) console.error(err);
    if (articles.length === 0) next();

    var article = articles[0];
    callback(article);
  });
}

/* GET news. */
router.get('/:id(\\d+)', function(req, res, next) {
  getArticle(req.params.id, next, function(article) {
    Filter.find({
      content: { $nin: article.locations },
      type: "location"
    },
    null,
    {
      sort: {
        content: 1
      }
    },
    function(err, filters) {
      if (err) console.error(err);
      res.render('news', {
        article: article,
        locations: filters
      });
    });
  });
});

/* POST news/:id/add_location/:location */
router.post('/:id(\\d+)/add_location/:location', function(req, res, next) {
  var _location = req.params.location;
  getArticle(req.params.id, next, function(article) {
    Filter.find({ content: _location, type: "location" }, function(err, filters) {
      if (err) console.error(err);
      if (filters.length === 0) next();
      if (article.locations.indexOf(_location) >= 0) {
        res.end();
        return;
      }

      article.update({ $push: { locations: _location } }, function(err) {
        if (err) console.error(err);
        res.json({ result: "success" });
      });
    });
  });
});

/* DELETE news/:id/location/:location_id */
router.delete("/:id(\\d+)/location/:location_id(\\d+)", function(req, res, next) {
  var locationId = req.params.location_id;
  getArticle(req.params.id, next, function(article) {
    if (locationId >= article.locations.length) next();
    article.update({ $pull: { locations: article.locations[locationId] } }, function(err) {
      if (err) console.error(err);
      res.json({ result: "success" });
    });
  });
});

/* POST news/:id/upvote */
router.post("/:id(\\d+)/upvote", function(req, res, next) {
  getArticle(req.params.id, next, function(article) {
    article.update({ $inc: { score: 1 } }, function(err) {
      if (err) console.log(err);
      res.json({ result: "success" });
    });
  });
});

/* POST news/:id/downvote */
router.post("/:id(\\d+)/downvote", function(req, res, next) {
  getArticle(req.params.id, next, function(article) {
    article.update({ $inc: { score: -1 } }, function(err) {
      if (err) console.log(err);
      res.json({ result: "success" });
    });
  });
});

module.exports = router;
