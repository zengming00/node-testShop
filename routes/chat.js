var express = require('express');

var router = express.Router();


// 首页
router.get('/', function(req, res, next) {
	var host = req.protocol + '://' + req.hostname;  //+':'+req.app.get('port');
    res.render('chat/index',{host: host});
});


module.exports = router;
