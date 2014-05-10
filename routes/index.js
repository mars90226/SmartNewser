var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Article = mongoose.model('Article');

/* GET home page. */
router.get('/', function(req, res) {
  Article.find(function(err, articles, count) {
    if (err) {
      console.error(err);
    }
    console.log(articles);
    var columns = [[], [], []];
    for (var i in articles) {
      columns[i % 3].push(articles[i]);
    }
    res.render('index', { columns: columns });
  });
});

module.exports = router;
