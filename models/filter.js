var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FilterSchema = new Schema({
  content: { type: String, required: true },
  type: { type: String, required: true }
});

var Filter = mongoose.model('Filter', FilterSchema);
