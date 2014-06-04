var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserArticleSchema = new Schema({
  userID: Schema.Types.ObjectId,
  articleID: Number
});

var UserArticle = mongoose.model('UserArticle', UserArticleSchema);
