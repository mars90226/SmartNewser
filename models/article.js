var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  time: { type: Date, required: true },
  link: { type: String, required: true },
  source: { type: String, required: true },
  locations: []
});

ArticleSchema.plugin(autoIncrement.plugin, 'Article')
var Article = mongoose.model('Article', ArticleSchema);
