var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment');

var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/SmartNewser';
var connection = mongoose.connect(mongoUri);
autoIncrement.initialize(connection)

mongoose.connection.on('error', function(err) {
  console.log(err);
});

mongoose.connection.once('open', function(err) {
  console.log('database connection established');
});

require('./models/article');
require('./models/filter');
require('./models/user');
require('./models/userArticle');
