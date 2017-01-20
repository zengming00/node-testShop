var mongoose = require("./Common");
var Schema = mongoose.Schema;


var GoodsSchema = mongoose.Schema({
    goods_name: String,
    cat_id: String,
    shop_price: Number,
    goods_img: String,
    goods_desc: String,
    goods_number:Number,
    is_best: Boolean,
    is_new: Boolean,
    is_hot: Boolean,
    is_on_sale: Boolean,
    add_time: {
        type: Date,
        default: Date.now
    },
    last_update: {
        type: Date,
        default: Date.now
    }
});

var GoodsModel = mongoose.model('goods', GoodsSchema);

exports = module.exports = GoodsModel;

