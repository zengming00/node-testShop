var express = require('express');

var router = express.Router();


// 首页
router.get('/', function(req, res, next) {
	var host = 'http://' + req.hostname;  //+':'+req.app.get('port');
    if(host === 'http://localhost'){
        host = 'http://localhost:3000';
    }
    res.render('chat/index',{host: host});
});


module.exports = router;
