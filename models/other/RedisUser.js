var redis = require("redis");


var client = redis.createClient('redis://192.168.1.1:6379');


// client.on("error", function (err) {
//     console.log("Error " + err);
// });
module.exports = User;

function User(obj){
    this.user = obj;
    for(var k in obj){
        this[k] = obj[k];
    }
}

User.prototype.save = function (fn) {
    if(this.user.id){
        this.update(fn);
    } else {
        var thisUser = this;
        var user = this.user;
        client.incr('user:ids', function (err, id) {
            if(err) return fn(err);
            user.id = id;
            thisUser.update(fn);
        })
    }
}

User.prototype.update = function (fn) {
    var user = this.user;
    client.set('user:id:' + user.name, user.id, function (err) {
        if(err) return fn(err);
        client.hmset('huser:' + user.id, user, function (err) {
            fn(err, user.id);
        })
    })
}

//存在返回User对象，不存在返回null
User.getUserByName = function (name, fn) {
    User.getUserId(name, function (err, value) {
        if(err) return fn(err);
        User.getUserById(value, fn);
    });
};

//存在返回id，不存在返回null
User.getUserId = function (name, fn) {
    client.get('user:id:'+name, fn);
}

//存在返回User对象，不存在返回null
User.getUserById = function (id, fn) {
    client.hgetall('huser:'+id, function (err, user) {
        if(err) return fn(err);
        fn(null, new User(user));
    })
}

User.login = function (name, password, fn) {
    User.getUserByName(name, function (err, user) {
        if(err) return fn(err);
        if(user){ //如果存在
            if(password === user.password){
                fn(null, user);
            }else{
                fn();
            }
        } else {
            fn();
        }
    })
}

var u1 = new User({
    name : 'zengming',
    password : 'aaasdfa'
})

u1.save(function (err, id) {
    if(err) throw err;
    console.log(id);
})

User.login('zengming','aaasdfaa',function (err, user) {
    if(err) throw err;
    if(user){
        console.log(user);
    } else {
        console.log("登录失败");
    }
})