var express = require('express');
var Z = require('zengming');



var goodsModel = require('../../models/GoodsModel');
var catModel = require('../../models/CatModel');
var userModel = require('../../models/UserModel');
var ordgoodsModel = require('../../models/OrdgoodsModel');
var ordinfoModel = require('../../models/OrdinfoModel');

var Comm = require('../../lib/Common');
var Verify = require('../../lib/Verify');

var c = require('./common');
//中间件，提供cats内容
var getCats = c.getCats;
var router = express.Router();




// 生成验证码
router.get('/verify', Verify.makeCapcha);


function encodePassword(pwd, salt) {
    return Z.md5(pwd + salt);
}

router.post('/reg', function (req, res) {
    if(!Verify.verify(req, req.body.yzm)){
        return res.json({error:'验证码错误'});
    }

    var $username = req.body.username;
    var $email = req.body.email;
    var $password = req.body.password;
    var $repassword = req.body.repassword;
    var $phone = req.body.phone;

    if (!/^(13[0-9]|14[5|7]|15\d|18\d)\d{8}$/.test($phone)) {
        return res.json({error:"手机号无法接受"});
    }
    if (!/^[a-zA-Z0-9]{6,16}$/.test($username) || $username === 'admin') {//直接拒绝admin账号
        return res.json({error:"用户名只能是6-16位英文字母+数字"});
    }
    if (!/^[a-zA-z0-9]+@[a-zA-z0-9]+(\.[a-zA-z0-9]+)+$/.test($email)) {
        return res.json({error:"邮箱无法接受"});
    }
    if (!/^[a-zA-Z0-9]{6,16}$/.test($password)) {
        return res.json({error:"密码只能是6-16位英文字母+数字"});
    } else if ($password !== $repassword) {
        return res.json({error:"两次密码不一致"});
    }

    //看用户名、手机、邮箱是否已存在
    var cond = {$or: [{userName: $username}, {phone: $phone}, {email: $email}]};
    userModel.find(cond,function (err, docs) {
        if (err){
            return res.json({error:err});
        }
        if(docs.length == 0) {//未找到返回空数组，此时才可以入库
            var $salt = Comm.makeSalt(6);
            var data = {
                userName: $username,
                phone: $phone,
                email: $email,
                password: encodePassword($password, $salt),
                salt: $salt
            };
            userModel.create(data, function (err, foo) {
                if (err){
                    return res.json({error:err});
                }
                res.json({success:'注册成功！'});
            });
        }else{
            res.json({error:'注册失败！请更换用户名、手机或邮箱'});
        }
    });
});

router.post('/login', function (req, res) {
    if(!Verify.verify(req, req.body.yzm)){
        return res.json({error:'验证码错误'});
    }
    var $username = req.body.username;
    var $password = req.body.password;

    //允许用户名、手机号、邮箱登录
    var cond = {$or: [{userName: $username}, {phone: $username}, {email: $username}]};
    userModel.findOne(cond, function (err, doc) {
        if (err){
            return res.json({error:err});
        }
        if(doc){
            if(doc.password === encodePassword($password, doc.salt)){
                req.session.user = doc;
                res.json({success:'登录成功！'});
            }else{
                res.json({error:'密码错误！'});
            }
        }else{
            res.json({error:'不存在的用户'});
        }
    });
});


router.get('/reg', getCats, function (req, res) {
    res.render('user/reg');
});


router.get('/login', getCats, function(req, res) {
    res.render('user/login');
});

router.get('/logout', function (req, res) {
    req.session.user = null;
    res.redirect('./login');
});

//之后的操作必需登录了用户
router.use(function (req, res, next) {
    if(req.session.user){
        next();
    }else{
        res.redirect('./login');
    }
});

router.all('/address', getCats, function (req, res) {
    if(req.method == 'GET'){
        res.render('user/address');
    } else {
        var addr = req.body.address + '  ' + req.body.name + '  ' + req.body.phone;
        var id = req.session.user._id;
        addr = addr.trim();
        userModel.findByIdAndUpdate(id, {$set:{address:addr}}, function (err, doc) {
            if(err) return res.send(err);
            req.session.user.address = addr;
            res.redirect('./address');
        });
    }
});

router.get('/favor', getCats, function (req, res) {
    res.render('user/favor');
});

router.get('/liuyan', getCats, function (req, res) {
    res.render('user/liuyan');
});

router.get('/orderlist', getCats, function (req, res) {
    ordinfoModel.find(function (err, docs) {
        if(err) return res.send(err);
        var data = {ords:docs};
        res.render('user/orderlist', data);
    });
});

router.all('/repwd', getCats, function (req, res) {
    if(req.method == 'POST'){
        var $oldpassword = req.body.old_password;
        var $password = req.body.new_password;
        var $repassword = req.body.comfirm_password;

        if (!/^[a-zA-Z0-9]{6,16}$/.test($password)) {
            return res.json({error:"密码只能是6-16位英文字母+数字"});
        } else if ($password !== $repassword) {
            return res.json({error:"两次密码不一致"});
        }

        var doc = req.session.user;
        if(doc.password === encodePassword($oldpassword, doc.salt)){
            //旧密码验证成功
            $password = encodePassword($password, doc.salt);
            var id = req.session.user._id;
            userModel.findByIdAndUpdate(id, {$set:{password:$password}}, function (err, doc) {
                if(err) return res.json({error:err});
                req.session.user.password = $password;
                res.json({success:'修改成功'});
            });
        }else{
            return res.json({error:"原密码错误"});
        }
    } else { //GET请求
        res.render('user/repwd');
    }
});

router.get('/info', getCats, function (req, res) {
    res.render('user/info');//ejs可以访问到res.locals.user的内容
});

module.exports = router;
