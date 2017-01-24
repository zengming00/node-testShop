var express = require('express');
var fstream = require('fstream');
var tar = require('tar');
var zlib = require('zlib');
var fs = require('fs');

var router = express.Router();

//打包下载功能
router.get('/',function(req,res){
    res.append('Content-Disposition', 'attachment; filename="uploads.tar"');
    //res.append('Content-Type', 'application/x-gzip');

    //var dir = 'C:/Users/Administrator/Desktop/shop';
    var dir = req.app.locals.__dirname + '/uploads';
    fstream.Reader({path: dir, type: 'Directory'})
        .pipe(tar.Pack())
        //.pipe(zlib.Gzip())
        .pipe(res);
});


module.exports = router;
