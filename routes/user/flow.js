var express = require('express');

var c = require('./common');
var getCats = c.getCats;
var router = express.Router();

var goodsModel = require('../../models/GoodsModel');
var catModel = require('../../models/CatModel');

router.get('/addToCart', function (req, res) {
    goodsModel.findById(req.query._id, function (err, doc) {
        if(err) return res.send(err);
        var cart = res.locals.cart;
        cart.add(doc._id.toString(), doc.goods_name, doc.goods_img, doc.shop_price, 1);
        req.session.cart = cart.items();
        res.redirect('./cart');
    })
});

router.get('/cart', getCats, function(req,res){
    console.log(res.locals.cart.items())
    res.render('flow/cart');
});

router.get('/checkout', getCats, function(req,res){
    res.render('flow/checkout');
});

router.get('/done', getCats, function(req,res){
    res.render('flow/done');
});


module.exports = router;
