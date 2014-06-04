var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  oauthID: Number,
  name: String
});

var User = mongoose.model('User', UserSchema);
