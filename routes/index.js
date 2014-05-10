var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Article = mongoose.model('Article');

/* GET home page. */
router.get('/', function(req, res) {
  var query = Article.find().sort({'time': -1}).limit(20);
  query.exec(function(err, articles, count) {
    if (err) {
      console.error(err);
    }
    var columns = [[], [], []];
    for (var i in articles) {
      columns[i % 3].push(articles[i]);
    }
    res.render('index', { columns: columns });
  });
});

/* GET news list */
router.get('/list.json', function(req, res) {
  var query = Article.find();
  if (req.query.source) {
    if (typeof req.query.source === "string") {
      query = query.where('source').equals(req.query.source);
    } else {
      query = query.where('source').in(req.query.source);
    }
  }
  if (req.query.time) {
    var date = new Date();
    switch(req.query.time) {
      case "1 day":
        date.setDate(date.getDate() - 1);
        break;
      case "1 week":
        date.setDate(date.getDate() - 7);
        break;
      case "1 month":
        date.setMonth(date.getMonth() - 1);
        break;
      case "1 year":
        date.setFullYear(date.getFullYear() - 1);
        break;
    }
    query = query.where('time').gt(date);
  }
  if (req.query.locations) {
    if (typeof req.query.locations === "string") {
      query = query.and([{ locations: req.query.locations }]);
    } else {
      var location_query = { $or: [] };
      for (var i in req.query.locations) {
        location_query["$or"].push({
          locations: req.query.locations[i]
        });
      }
      query = query.and([location_query]);
    }
  }
  if (req.query.content) {
    query = query.and({ content: new RegExp(req.query.content, "i") });
  }
  query.sort({ "time": -1 })
       .exec(function(err, articles) {
    if (err) {
      console.error(err);
      res.json({error: err.name}, 500);
    }

    res.json(articles);
  });
});

module.exports = router;
