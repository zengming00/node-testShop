var express = require('express');

var router = express.Router();


// 首页
router.get('/', function(req, res, next) {
    res.render('chat/index',{host: req.header('Host')});
});


module.exports = router;
