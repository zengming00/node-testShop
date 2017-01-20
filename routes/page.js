var express = require('express');
var router = express.Router();

var Page = require('../lib/Page');


// 首页
router.get('/', function(req, res, next) {
    var $page = new Page(req, 51, 10);
    var data = {
        limit: "limit {" + $page.firstRow + "," + $page.listRows + "}",
	    page: $page.show()
    };
    res.render('Page/index',data);
});



module.exports = router;
