var mongoose = require("./Common");
var Schema = mongoose.Schema;

var OrdinfoSchema = mongoose.Schema({
    ordId: String,
    userId: String,
    userName: String,
    address: String,
    payType: String,
    payState: Boolean,
    money: Number,
    fuyan: String
});

var OrdinfoModel = mongoose.model('ordinfo', OrdinfoSchema);

exports = module.exports = OrdinfoModel;

