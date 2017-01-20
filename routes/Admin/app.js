var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var catModel = require('../../models/CatModel');

var multer  = require('multer');

var upload = multer({
    dest: 'uploads/',
    fileFilter: function fileFilter (req, file, cb) {
        console.log(file);
        // 这个函数应该调用 `cb` 用boolean值来
        // 指示是否应接受该文件
        // 拒绝这个文件，使用`false`, 像这样:
        //cb(null, false)
        // 接受这个文件，使用`true`, 像这样:
        cb(null, true);
        // 如果有问题，你可以总是这样发送一个错误:
        //cb(new Error('I don\'t have a clue!'));
    }
});



router.post('/cateadd', upload.none(), function(req, res, next) {
    var data = {
        cat_name: req.body.cat_name,
        intro: req.body.cat_desc,
        parent_id: req.body.parent_id
    };
    catModel.create(data, function (err, data) {
        if (err){
            res.send(err);
        }else{
            res.redirect('./catelist');
        }
    });
});

router.post('/cateedit', upload.none(), function (req, res) {
    if(req.body.cat_id == req.body.parent_id){
        return res.send("错误的上级栏目");
    }
    var data = {
        cat_name: req.body.cat_name,
        intro: req.body.cat_desc,
        parent_id: req.body.parent_id
    };
    catModel.findByIdAndUpdate(req.body.cat_id, data, function (err, doc) {
        if(err) return res.send(err);
        res.redirect('./catelist');
    })
})

router.get(['/catelist','/cateadd','/cateedit', '/goodsadd'], function (req, res) {
    catModel.find(function (err, rows) {
        if(err) return res.send(err);
        var data = {
            tree: catModel.getTree(rows)
        }
        switch(req.path){
            case '/catelist':
                res.render('Admin/Index/catelist', data);
                break;
            case '/cateedit':
                catModel.findById(req.query._id, function (err, cate) {
                    if(err) return res.send(err);
                    if(cate == null){
                        return res.send('错误的栏目id');
                    }
                    data.cate = cate;
                    res.render('Admin/Index/cateedit', data);
                })
                break;
            case '/cateadd':
                res.render('Admin/Index/cateadd', data);
                break;
            case '/goodsadd':
                res.render('Admin/Index/goodsadd', data);
                break;
        }
    })
});

router.get('/catedel', function (req,res) {
    catModel.findByIdAndRemove(req.query._id, function (err, cate) {
        if(err){
            res.send(err);
        }else{
            res.redirect('./catelist');
        }
    });
});

router.post('/goodsadd', upload.single('goods_img'), function (req, res) {
    console.log(req.file);
    res.send(req.body)
})


router.get(['/','/*.html'],function (req,res) {
    var options = {
        root: req.app.locals.__dirname + '/views/Admin/Index/'
    }
    if(req.path == '/'){
        req.path = '/index.html';
    }
    res.sendFile(req.path, options);
})
module.exports = router;
