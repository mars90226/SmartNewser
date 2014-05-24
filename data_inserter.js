require('./db');

var fs = require('fs'),
    mongoose = require('mongoose');

var Article = mongoose.model('Article');

var finishedCount = 0;
[1, 2, 3].forEach(function(index) {
  fs.readFile("temp_data/article" + index + ".json", function(err, data) {
    if (err) throw err;
    var article = JSON.parse(data);
    article.time = new Date(Date.parse(article.time));
    article = new Article(article);
    article.save(function(err, newArticle) {
      if (err) { console.error(err); }
      finishedCount++;
      if (finishedCount == 3) {
        mongoose.connection.close();
      }
    });
  });
});
