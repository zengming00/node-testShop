var express = require('express');
var Promise = require('bluebird');


var router = express.Router();

var goodsModel = require('../../models/GoodsModel');
var catModel = require('../../models/CatModel');

router.get('/', function (req, res, next) {
    var pms = [
        catModel.find(),
        goodsModel.find({is_best:true, is_on_sale:true}, null, {_id:-1, limit:3}),//两种写法，哪种更好呢？
        goodsModel.find({is_new:true, is_on_sale:true}).sort({_id:-1}).limit(3),
        goodsModel.find({is_hot:true, is_on_sale:true}).sort({_id:-1}).limit(3)
    ];
    Promise.all(pms).then(function(datas){
        var data = {
            tree: catModel.getTree(datas[0]),
            bestGs: datas[1],
            newGs: datas[2],
            hotGs: datas[3]
        };
        res.render('Home/Index/index', data);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/goods', function(req, res, next) {
    //TODO 添加到历史记录
    var pms = [
        catModel.find(),
        goodsModel.findById(req.query._id)
    ];

    Promise.all(pms).then(function(datas){
        var cats = datas[0];
        var gs = datas[1];
        var data = {
            gs : gs,
            tree : catModel.getTree(cats),
            family: catModel.getFamily(cats, gs.cat_id)
        };
        res.render('Home/Index/goods', data);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/category', function(req, res) {
    // TODO 分页
    catModel.find(function (err, cats) {
        if(err) return res.send(err);

        var catid= req.query.cat_id;
        var childs = catModel.getChildCates(cats, catid);
        childs.unshift(catid);
        goodsModel.find({cat_id:{$in:childs}}, function (err, docs) {
            if(err) return res.send(err);
            var data = {
                gs : docs,
                tree : catModel.getTree(cats),
                family: catModel.getFamily(cats, req.query.cat_id)
            };
            res.render('Home/Index/category', data);
        })
    })
});

//其它静态资源
router.get('/*.html', function (req, res) {
    var options = {
        root: req.app.locals.__dirname + '/views/Home/Index/'
    };
    res.sendFile(req.path, options);
});

module.exports = router;
