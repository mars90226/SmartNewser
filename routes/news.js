var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var Filter = mongoose.model('Filter');

/* GET news. */
router.get('/:id(\\d+)', function(req, res, next) {
  Article.find({ _id: req.params.id }, function(err, articles) {
    if (err) console.error(err);
    if (articles.length === 0) next();
    Filter.find({ type: "location" }, function(err, filters) {
      if (err) console.error(err);
      res.render('news', {
        article: articles[0],
        locations: filters
      });
    });
  });
});

/* POST news/:id/add_location/:location */
router.post('/:id(\\d+)/add_location/:location', function(req, res, next) {
  var id = req.params.id;
  var _location = req.params.location;
  Article.find({ _id: id }, function(err, articles) {
    if (err) console.error(err);
    if (articles.length === 0) next();

    var article = articles[0];
    Filter.find({ content: req.params.location, type: "location" }, function(err, filters) {
      if (err) console.error(err);
      if (filters.length === 0) res.end();

      var filter = filters[0];
      if (article.locations.indexOf(filter) >= 0) res.end();
      article.update({ $push: { locations: _location } }, function(err) {
        if (err) console.error(err);
        res.json({ result: "success" });
      });
    });
  });
});

/* DELETE news/:id/location/:location_id */
router.delete("/:id(\\d+)/location/:location_id(\\d+)", function(req, res, next) {
  var id = req.params.id;
  var locationId = req.params.location_id;
  Article.find({ _id: id }, function(err, articles) {
    if (err) console.error(err);
    if (articles.length === 0) next();

    var article = articles[0];
    if (locationId >= article.locations.length) next();
    article.update({ $pull: { locations: article.locations[locationId] } }, function(err) {
        if (err) console.error(err);
        res.json({ result: "success" });
    });
  });
});

module.exports = router;
