var mongoose = require("./Common");
var Schema = mongoose.Schema;

var OrdgoodsSchema = mongoose.Schema({
    ordId: String,
    goodsId: String,
    goodsName: String,
    price: Number,
    num: Number
});


var OrdgoodsModel = mongoose.model('ordgoods', OrdgoodsSchema);

exports = module.exports = OrdgoodsModel;

