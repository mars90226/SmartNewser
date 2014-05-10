var mongoose = require('mongoose');

mongoose.connect('mongodb://10.5.3.25/SmartNewser');

mongoose.connection.on('error', function(err) {
  console.log(err);
});

mongoose.connection.once('open', function(err) {
  console.log('database connection established');
});

require('./models/article');
