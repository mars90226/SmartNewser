var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  time: { type: Date, required: true },
  link: { type: String, required: true },
  source: { type: String, required: true },
  locations: []
});

var Article = mongoose.model('Article', ArticleSchema, 'Article');
