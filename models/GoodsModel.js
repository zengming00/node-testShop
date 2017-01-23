var mongoose = require("./Common");
var Schema = mongoose.Schema;


var GoodsSchema = mongoose.Schema({
    goods_name: String,
    cat_id: String,
    shop_price: Number,
    goods_img: String,
    goods_desc: String,
    goods_number:Number,
    is_best: {type: Boolean, default: false},
    is_new: {type: Boolean, default: false},
    is_hot: {type: Boolean, default: false},
    is_on_sale: {type: Boolean, default: false}
},{ timestamps: true }); //开启时间戳功能，自动维护 updatedAt 和 createdAt 字段


var GoodsModel = mongoose.model('goods', GoodsSchema);

exports = module.exports = GoodsModel;

