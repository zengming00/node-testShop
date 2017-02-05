var express = require('express');
var Z = require('zengming');
var comm = require('../../lib/Common');

var c = require('./common');
var getCats = c.getCats;
var router = express.Router();

var goodsModel = require('../../models/GoodsModel');
var catModel = require('../../models/CatModel');

router.get('/cartApi', function (req, res) {
    var cart = res.locals.cart;
    switch(req.query.a){
        case 'add':
            goodsModel.findById(req.query._id, function (err, doc) {
                if(err) return res.send(err);
                cart.add(doc._id.toString(), doc.goods_name, doc.goods_img, doc.shop_price, 1);
                req.session.cart = cart.items();
                res.redirect('./cart');
            });
            break;
        case 'del':
            cart.del(req.query._id);
            res.redirect('./cart');
            break;
        case 'incr':
            cart.incr(req.query._id);
            res.redirect('./cart');
            break;
        case 'decr':
            cart.decr(req.query._id);
            res.redirect('./cart');
            break;
        default:
            res.redirect('./cart');
    }
});

router.get('/cart', getCats, function(req,res){
    res.render('flow/cart');
});

//之后的操作必需登录了用户
router.use(function (req, res, next) {
    if(req.session.user){
        next();
    }else{
        res.redirect('/user/login');
    }
});

router.get('/checkout', getCats, function(req,res){
    res.render('flow/checkout');
});

router.post('/done', getCats, function(req,res){
    /*

     { id: '588444c35068ce1f2020e423',
     name: 'Letv/乐视 X800',
     price: 1229,
     num: 1 }


     */
    var date = comm.getCnDate();
    var ordId = '' + date.getFullYear() + (date.getMonth()+1) + date.getDate()
        + date.getHours() + date.getMinutes() + date.getSeconds()
        + Z.rand(0, 999);

    var cart = res.locals.cart.items();
    for(var i=0; i<cart.length; i++){
        var goods = cart[i];


    }

    console.log(req.body.fuyan);
    console.log(cart);
    res.render('flow/done');
});


module.exports = router;
