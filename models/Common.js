var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var uri = 'mongodb://zengming:zengming@ds047146.mlab.com:47146/zengming';
mongoose.connect(uri);
var db = mongoose.connection;

db.on('error', function (err) {
    console.log(__filename, err.message);
});

exports = module.exports = mongoose;

