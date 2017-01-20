var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

//经测试，不用担心mongoose断线重连和效率的问题，默认会自动重连，连接池也默认够用的

var uri = 'mongodb://zengming:zengming@ds047146.mlab.com:47146/zengming';
mongoose.connect(uri);

var db = mongoose.connection;
console.log(__filename);
db.on('error', function (err) {
    console.log(__filename, err);
});
db.once('open', function() {
    console.log("we're connected!");
    var kittySchema = mongoose.Schema({
        name: String,
        foo: Object
    });
    kittySchema.methods.speak = function () {
        var greeting = this.name
            ? "Meow name is " + this.name
            : "I don't have a name";
        console.log(greeting);
    }

    var Kitten = mongoose.model('Kitten', kittySchema);//这个Kitten就是表名

    var silence = new Kitten({ name: 'Silence1', foo:[1,3,{a:"asdf",b:true}] });
    console.log(silence.name); // 'Silence'
    silence.speak();

    silence.save(function (err, sil) {
        if (err) return console.error(err);
        console.log("save ok");
        sil.speak();

        Kitten.find({}, function (err, kittens) {
            if (err) return console.error(err);
            console.log('kittens:');
            console.log(kittens);
        })
        Kitten.find({'i':{$exists:true}}).skip(1).limit(3).exec(function (err, datas) {
            if(err) return console.error(err);
            console.log("1111111111111111");
            console.log(datas);
        })
        Kitten.count({'i':{$exists:true}}, function (err, num) {
            if(err)  return console.err(err);
            console.log("count(*) = " + num);
        })
    });


    Kitten.remove({name:"Silence1"}, function(err){
        if (err) return console.error(err);
        console.log("remove ok");
    })

    process.stdin.on('readable', function () {
        var chunk = process.stdin.read().toString().trim();
        console.log('========'+chunk+'========');
        switch (chunk) {
            case "c":
                Kitten.create({ name: 'foo' }, function (err, foo) {
                    if (err) return console.err(err);
                    console.log(foo);
                });
                break;
            case "r":
                Kitten.find({}, function (err, kittens) {
                    if (err) return console.error(err);
                    console.log('all Data:');
                    console.log(kittens);
                });
                break;
            case "u":
                //默认就是只更新一条
                Kitten.update({ name: 'foo' }, { name: "haha" }, { multi: false }, function (err, raw) {
                    if (err) return console.err(err);
                    console.log('The raw response from Mongo was ', raw);
                });
                break;
            case "d":
                Kitten.remove({name:"haha"}, function(err){
                    if (err) return console.error(err);
                    console.log("remove ok");
                })
                break;
            default:
                Kitten.find({_id:chunk}, function (err, kittens) {
                    if (err) return console.error(err);
                    console.log('all Data:');
                    console.log(kittens);
                });
        }
    });
});




















