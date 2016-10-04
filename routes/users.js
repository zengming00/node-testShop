var express = require('express');
var Promise = require('bluebird');
var UserModel = require('../models/User');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/regUser', function (req, res) {
    var $username = req.body.username;
    var $email = req.body.email;
    var $password = req.body.password;
    var $repassword = req.body.repassword;
    var $phone = req.body.phone;

    if (!/^(13[0-9]|14[5|7]|15\d|18\d)\d{8}$/.test($phone)) {
        return res.send("手机号不合法");
    }
    if (!/^[a-zA-Z0-9]{1,16}$/.test($username)) {
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
    UserModel.regUser($username, $password, $phone, $email).then(function () {
        res.send("注册成功");//前台ajax收到Ok才提示成功
    }).catch(function (e) {
        console.log(e);
    });
});

router.all('/getUsers', function (req, res) {
    var $page = req.body.page ? req.body.page : 1;
    var $rows = req.body.rows ? req.body.rows : 10;
    var $offset = ($page - 1) * $rows;

    var arr = [UserModel.count(), UserModel.getUsers($offset, $rows)];
    Promise.all(arr).then(function (datas) {
        var obj = {total: datas[0].rows[0].count, rows: datas[1].rows};
        res.json(obj);
    }).catch(function (e) {
        console.log(e);
    });
})

module.exports = router;
