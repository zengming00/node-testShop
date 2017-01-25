var mongoose = require('./../Common');
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
