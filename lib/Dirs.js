var fs = require('fs');
var strftime = exports.strftime = require('strftime').timezone('+0800');

/*
 批量创建文件夹
 base = C:\Users\Administrator\test 通常用 __dirname 获得当前文件夹
 path = /uploads/2017/01/20    /uploads   uploads/  uploads  (推荐是前后都加/)
 cb(err) 回调只有一个参数
 */
function mkdirs(base, path, cb) {
    if(path == '') return cb && cb();//完成
    var cur = path;
    var next = '';
    var i = path.indexOf('/');
    if(i != -1){
        cur =  path.substring(0,i);
        next = path.substring(i+1);
    }
    if(cur == ''){
        return mkdirs(base, next, cb);
    }
    cur = base + '/' + cur;

    fs.mkdir(cur, function (err) {
        if(err && (err.code != 'EEXIST')) return cb && cb(err);
        mkdirs(cur, next, cb);
    })
}
/**
 * 获取日期文件夹（不存在则自动创建）
 * @param baseDir 必需保证此文件夹存在
 * @param cb(err, path) path末尾会带/
 */
function getDateDir(baseDir, cb) {
    var dir = strftime('/%Y/%m/%d/');
    var path = baseDir + dir;
    fs.access(path, function (e) {
        if(e){ //文件夹不存在
            mkdirs(baseDir, dir, function (e) {
                cb(e, {dir:dir, fullpath:path});
            });
        }else{
            cb(null, {dir:dir, fullpath:path});
        }
    })
}


exports.mkdirs = mkdirs;
exports.getDateDir = getDateDir;