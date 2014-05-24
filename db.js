var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.connect('mongodb://localhost/SmartNewser');
autoIncrement.initialize(connection)

mongoose.connection.on('error', function(err) {
  console.log(err);
});

mongoose.connection.once('open', function(err) {
  console.log('database connection established');
});

require('./models/article');
