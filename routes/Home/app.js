var express = require('express');
var router = express.Router();
var goodsModel = require('../../models/GoodsModel');
var catModel = require('../../models/CatModel');

router.get('/', function (req, res) {
    catModel.find(function (err, cats) {
        if (err) return res.send(err);
        var data = {
            tree: catModel.getTree(cats)
        };
        res.render('Home/Index/index', data);
    });
});

router.get('/goods', function(req, res) {
    //TODO 添加到历史记录
    catModel.find(function (err, cats) {
        if(err) return res.send(err);
        goodsModel.findById(req.query._id, function (err, doc) {
            if(err) return res.send('错误的ID');
            var data = {
                gs : doc,
                tree : catModel.getTree(cats),
                family: catModel.getFamily(cats, doc.cat_id)
            };
            res.render('Home/Index/goods', data);
        })
    })
});

router.get('/category', function(req, res) {
    catModel.find(function (err, cats) {
        if(err) return res.send(err);
        goodsModel.find({cat_id:req.query.cat_id}, function (err, docs) {
            if(err) return res.send(err);
            console.log(docs)
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
