var express = require('express');
var fs = require('fs');
var path = require('path');
var multer  = require('multer');

var catModel = require('../../models/CatModel');
var goodsModel = require('../../models/GoodsModel');
var Dirs = require('../../lib/Dirs');
var Page = require('../../lib/Page');

var router = express.Router();

var upload = multer({
    dest: 'uploads/', //前面不能带/否则会认为是绝对路径导致上传失败
    fileFilter: function fileFilter (req, file, cb) {
        if(file.mimetype.substring(0, 'image'.length) == 'image'){
            cb(null, true);// 接受这个文件
        }else{
            //cb(new Error('只能上传图片！'));
            cb(null, false);// 拒绝这个文件
        }
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
    });
});

router.get(['/catelist','/cateadd','/cateedit', '/goodsadd'], function (req, res) {
    catModel.find(function (err, rows) {
        if(err) return res.send(err);
        var data = {
            tree: catModel.getTree(rows)
        };
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
                });
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
    //TODO 删除栏目下的子栏目
    catModel.findByIdAndRemove(req.query._id, function (err, cate) {
        if(err){
            res.send(err);
        }else{
            res.redirect('./catelist');
        }
    });
});

router.post('/goodsadd', upload.single('goods_img'), function (req, res) {
    if(req.file){ //必需上传了图片
         /*req.file = { fieldname: 'goods_img',
         originalname: '139746815261.gif',
         encoding: '7bit',
         mimetype: 'image/gif',
         destination: 'uploads/',
         filename: 'c5ebc409665c170f8c0f478868eed8cb',
         path: 'uploads\\c5ebc409665c170f8c0f478868eed8cb',
         size: 27845 }*/
        var file = req.file;
        console.log(file);
        var uploadsDir = '/' + file.destination;
        var baseDir = req.app.locals.__dirname + uploadsDir; //文件上传目录的完整路径
        var ext = file.originalname;
        ext = ext.substring(ext.lastIndexOf('.')+1);
        var newfile = file.filename + '.' + ext; //不含路径的新文件名
        Dirs.getDateDir(baseDir, function (err, path) {//判断并自动创建带日期的文件夹，返回完整路径
            if(err) return res.send(err);
            var oldfile = baseDir + file.filename;
            fs.rename(oldfile, path.fullpath + newfile, function (err) {//移动到新文件夹，并改名
                if(err) return res.send(err);
                //TODO 商品的栏目ID是否应该必需是存在的栏目
                //req.body = {"goods_name":"1","cat_id":"588164fdea7eb10f303ca2bf","shop_price":"0.15",
                // "goods_desc":"详细描述","goods_number":"1","is_on_sale":"1","act":"insert"}
                var goods = new goodsModel(req.body);//act字段因为没在Schema定义所以不会插入
                goods.goods_img = uploadsDir + path.dir + newfile;
                goods.save(function (err, doc) {//入库保存
                    if(err) return res.send(err);
                    //res.send(doc);
                    res.redirect('./goodslist');
                })
            })
        })
    }else{
        res.send("商品必需带有图片");
    }
});

router.get('/goodslist', function (req, res) {
    goodsModel.find(function (err, docs) {
        if(err) return res.send(err);
        var data = {
            goods: docs
        };
        res.render('Admin/Index/goodslist', data);
    });
});

router.get('/goodsdel', function (req, res) {
    //TODO 删除图片等相关的资源文件
    goodsModel.findByIdAndRemove(req.query._id, function (err, doc) {
        if(err){
            res.send(err);
        }else{
            res.redirect('./goodslist');
        }
    });
})





//其它静态资源
router.get(['/','/*.html'],function (req,res) {
    var options = {
        root: req.app.locals.__dirname + '/views/Admin/Index/'
    };
    if(req.path == '/'){
        req.path = '/index.html';
    }
    res.sendFile(req.path, options);
});
module.exports = router;
