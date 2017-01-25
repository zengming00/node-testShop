var express = require('express');
var Z = require('zengming');



var goodsModel = require('../../models/GoodsModel');
var catModel = require('../../models/CatModel');
var userModel = require('../../models/UserModel');
var Comm = require('../../lib/Common');

var router = express.Router();

// 验证码
router.get('/verify', function (req, res) {
    var data = Comm.makeCapcha();
    req.session.verify = data.code;
    res.set('Content-Type', 'image/bmp');
    res.send(data.data);
});


router.post('/reg', function (req, res) {
    var verify = req.session.verify || '';
    var yzm = req.body.yzm.toUpperCase();

    req.body.isOk = (verify === yzm) ? 'yes' : 'no';
    res.json(req.body);


    var $username = req.body.username;
    var $email = req.body.email;
    var $password = req.body.password;
    var $repassword = req.body.repassword;
    var $phone = req.body.phone;


    if (!/^(13[0-9]|14[5|7]|15\d|18\d)\d{8}$/.test($phone)) {
        return res.send("手机号不合法");
    }
    if (!/^[a-zA-Z0-9]{6,16}$/.test($username)) {
        return res.send("用户名不符合规定");
    }
    if (!/^[a-zA-z0-9]+@[a-zA-z0-9]+(\.[a-zA-z0-9]+)+$/.test($email)) {
        return res.send("邮箱格式不符合规定");
    }
    if (!/^[a-zA-Z0-9]{6,16}$/.test($password)) {
        return res.send("密码不符合规定");
    } else if ($password !== $repassword) {
        return res.send("两次密码不一致");
    }

    //TODO 入库
});

router.post('/login', function (req, res) {
    var verify = req.session.verify || '';
    var username = req.body.username;
    var password = req.body.password;
    var yzm = req.body.yzm.toUpperCase();

    if(verify === yzm){
        console.log('验证码正确')
    }else{
        console.log('验证码错误，正确的是：'+verify)
    }
    console.log(req.body);

    res.send(req.body);
});

//中间件，对之后的路由提供cats内容
router.use(function (req, res, next) {
    if(req.method === 'GET'){
        switch (req.path){ //进行更严格的筛选是必要的，因为其它路径有可能也会执行查找操作，造成资源浪费
            case '/reg':
            case '/login':{
                catModel.find(function (err, docs) {
                    if(err) return next(err);
                    res.locals.tree = catModel.getTree(docs);
                    next();
                });
                break;
            }
            default:
                next();
        }
    }else{
        next();
    }
});

router.get('/reg', function (req, res) {
    res.render('user/reg');
});

router.get('/login', function(req, res) {
    res.render('user/login');
});


module.exports = router;
