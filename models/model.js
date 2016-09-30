var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var uri = 'mongodb://zengming:zengming@ds047146.mlab.com:47146/zengming';

mongoose.connect(uri);
var Schema = mongoose.Schema;

var demoSchema = new Schema({
    uid: String,
    title: String,
    content: String,
    createTime: {
        type: Date,
        default: Date.now
    }
});

exports = module.exports = mongoose.model('demo', demoSchema);
