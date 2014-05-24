var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  time: { type: Date, required: true },
  link: { type: String, required: true },
  source: { type: String, required: true },
  scores: { type: Number, default: 0 },
  locations: []
});

ArticleSchema.plugin(autoIncrement.plugin, 'Article')
var Article = mongoose.model('Article', ArticleSchema);

exports.select = function(selector, callback) {
  var query = Article.find();
  if (selector.source) {
    if (typeof selector.source === "string") {
      query = query.where('source').equals(selector.source);
    } else {
      query = query.where('source').in(selector.source);
    }
  }
  if (selector.date) {
    var date = new Date();
    switch(selector.date) {
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
  if (selector.locations) {
    if (typeof selector.locations === "string") {
      query = query.and([{ locations: selector.locations }]);
    } else {
      var location_query = { $or: [] };
      for (var i in selector.locations) {
        location_query["$or"].push({
          locations: selector.locations[i]
        });
      }
      query = query.and([location_query]);
    }
  }
  if (selector.content) {
    query = query.and({ content: new RegExp(selector.content, "i") });
  }
  query.sort({ "time": -1 }) .exec(function(err, articles) {
    callback(err, articles);
  });
};
