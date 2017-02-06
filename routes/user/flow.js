var express = require('express');
var Z = require('zengming');
var Promise = require('bluebird');

var comm = require('../../lib/Common');

var c = require('./common');
var getCats = c.getCats;
var router = express.Router();

var goodsModel = require('../../models/GoodsModel');
var catModel = require('../../models/CatModel');
var ordgoodsModel = require('../../models/OrdgoodsModel');
var ordinfoModel = require('../../models/OrdinfoModel');


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
    if(res.locals.cart.items().length>0){
        res.render('flow/checkout');
    }else{
        res.send('购物车为空');
    }
});


router.post('/done', getCats, function(req,res){
    var date = comm.getCnDate();
    var ordId = '' + date.getFullYear() + (date.getMonth()+1) + date.getDate()
        + date.getHours() + date.getMinutes() + date.getSeconds()
        + Z.rand(0, 999);

    function updateGoods(ordgoods) {
        return new Promise(function(resolve,reject){
            //查找商品数量大于等于购买数量（因为更新是原子操作，不会产生与其它用户冲突的问题）
            goodsModel.findOneAndUpdate({_id: ordgoods.goodsId, goods_number: {$gte: ordgoods.num}}
                , {$inc: {goods_number: -ordgoods.num}}
                , function (err, doc) {
                    //出错或未找到
                    if (err || doc == null) { //没找到符合条件的doc返回null，err不会有值
                        reject(ordgoods);
                    } else {//成功更新返回旧的doc
                        //TODO 库存减为0时(旧文档的数量等于减库存的数量），将商品下架
                        resolve(ordgoods);
                    }
                });
        });
    }
    //减库存操作
    var pms = [];
    var cart = res.locals.cart.items();
    for(var i=0; i<cart.length; i++){
        var goods = cart[i];
        if(goods.num > 0) {
            var ordgoods = {
                ordId: ordId,
                goodsId: goods.id,
                goodsName: goods.name,
                price: goods.price,
                num: goods.num
            };
            pms.push(updateGoods(ordgoods));
        }
    }
    if(pms.length == 0){
        res.send("没有购买商品");
        return;
    }
    Promise.all(pms).then(function(datas){//所有减库存操作都成功
        var user = req.session.user;
        var cart = res.locals.cart;
        var ordinfo = {
            ordId: ordId,
            userId: user._id,
            userName: user.userName,
            address: user.address,
            payType: 'RMB',
            payState: false,
            money: cart.getTotalMoney(),
            fuyan: req.body.fuyan
        };
        //订单入库
        var pms = [
            ordgoodsModel.create(datas),
            ordinfoModel.create(ordinfo)
        ];
        Promise.all(pms).then(function (d) {
            for(var i=0; i<datas.length; i++){
                cart.del(datas[i].goodsId);//从购物车中删除
            }
            console.log(d);
            res.render('flow/done',{
                ordId: ordId,
                money: ordinfo.money,
                payForm: comm.getPayForm(ordId, ordinfo.money)
            });
        }).catch(function (err) {
            res.send(err);
        });
    }).catch(function (err) {
        //err是ordgoods
        res.send('下单失败！    ' + err.goodsName + "   商品库存不足！");
    });
});


module.exports = router;
