var express = require('express');
var Promise = require('bluebird');
var Util = require('util');
var Z = require('zengming');

var router = express.Router();

var goodsModel = require('../models/GoodsModel');
var catModel = require('../models/CatModel');
var Page = require('../lib/Page.class');


router.get('/', function (req, res, next) {
    var pms = [
        catModel.find(),
        goodsModel.find({is_best:true, is_on_sale:true}, null, {sort:{_id:-1}, limit:3}),//两种写法，哪种更好呢？
        goodsModel.find({is_new:true, is_on_sale:true}).sort({_id:-1}).limit(3),
        goodsModel.find({is_hot:true, is_on_sale:true}).sort({_id:-1}).limit(3)
    ];
    Promise.all(pms).then(function(datas){
        var data = {
            history : req.session.history || [],
            tree: catModel.getTree(datas[0]),
            bestGs: datas[1],
            newGs: datas[2],
            hotGs: datas[3]
        };
        res.render('index', data);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/goods', function(req, res, next) {
    var pms = [
        catModel.find(),
        goodsModel.findById(req.query._id)
    ];

    Promise.all(pms).then(function(datas){
        var cats = datas[0];
        var gs = datas[1];

        //添加到历史记录
        var gsData = {
            _id:gs._id.toString(),
            goods_img:gs.goods_img,
            goods_name:gs.goods_name,
            shop_price:gs.shop_price
        };
        var history = req.session.history || [];
        var temp = [];
        for(var i=0; i<history.length; i++){ //过滤重复数据
            if(history[i]._id != gsData._id){
                temp.push(history[i]);
            }
        }
        temp.unshift(gsData);//插入到前面
        if(temp.length > 5){
            temp.pop();
        }
        req.session.history = temp;

        //渲染
        var data = {
            gs : gs,
            tree : catModel.getTree(cats),
            family: catModel.getFamily(cats, gs.cat_id)
        };
        res.render('goods', data);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/category', function(req, res) {
    catModel.find(function (err, cats) {
        if(err) return res.send(err);

        var catid= req.query.cat_id;
        var childs = catModel.getChildCates(cats, catid);
        childs.unshift(catid);//将当前栏目也包含在内
        var gsCond = {cat_id:{$in:childs}};//查询条件
        goodsModel.count(gsCond, function(err, num){
            if(err) return res.send(err);
            var page = new Page(req, num, 9);//取得分页参数
            goodsModel.find(gsCond, null, {skip:page.firstRow, limit:page.listRows}, function (err, docs) {
                if(err) return res.send(err);
                var data = {
                    gs : docs,
                    history : req.session.history || [],
                    page: page.show(),
                    tree : catModel.getTree(cats),
                    family: catModel.getFamily(cats, req.query.cat_id)
                };
                res.render('category', data);
            });
        });
    });
});

/*
//其它静态资源
router.get('/*.html', function (req, res) {
    var options = {
        root: req.app.locals.__dirname + '/views/Home/Index/'
    };
    res.sendFile(req.path, options);
});
*/
module.exports = router;
