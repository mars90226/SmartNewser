var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserArticleSchema = new Schema({
  userID: Schema.Types.ObjectId,
  articleID: Number,
  type: String
});

var UserArticle = mongoose.model('UserArticle', UserArticleSchema);
