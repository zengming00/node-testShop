var Z = require('zengming');
var Util = require('util');



function makeCapcha() {
    var img = new Z.BMP24(100, 40);
    img.drawCircle(11, 11, 10, Z.rand(0, 0xffffff));
    img.drawRect(0, 0, img.w-1, img.h-1, Z.rand(0, 0xffffff));
    img.fillRect(53, 15, 88, 35, Z.rand(0, 0xffffff));
    img.drawLine(50, 6, 3, 60, Z.rand(0, 0xffffff));
    //return img;

    //画曲线
    var w=img.w/2;
    var h=img.h;
    var color = Z.rand(0, 0xffffff);
    var y1=Z.rand(-5,5); //Y轴位置调整
    var w2=Z.rand(10,15); //数值越小频率越高
    var h3=Z.rand(4,6); //数值越小幅度越大
    var bl = Z.rand(1,5);
    for(var i=-w; i<w; i+=0.1) {
        var y = Math.floor(h/h3*Math.sin(i/w2)+h/2+y1);
        var x = Math.floor(i+w);
        for(var j=0; j<bl; j++){
            img.drawPoint(x, y+j, color);
        }
    }

    var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZ3456789";
    var str = '';
    for(var i=0; i<5; i++){
        str += p.charAt(Math.random() * p.length |0);
    }

    var fonts = [Z.Font.font8x16, Z.Font.font12x24, Z.Font.font16x32];
    var x = 15, y=8;
    for(var i=0; i<str.length; i++){
        var f = fonts[Math.random() * fonts.length |0];
        y = 8 + Z.rand(-10, 10);
        img.drawChar(str[i], x, y, f, Z.rand(0, 0xffffff));
        x += f.w + Z.rand(2, 8);
    }
    return {code:str, data:img.getFileData()};
}


function getPayForm(ordID, money){
    var v_mid = '20272562'; //商户号，不可改
    var v_oid = ordID; //订单号
    var v_amount = money; //金额
    var v_moneytype = 'CNY'; //币种
    var v_url = 'http://www.xx.com';
    var v_key = '%()#QOKFDLS:1*&U'; //密匙，不可改

    //MD5校验串生成方法：当消费者在商户端生成最终订单的时候，
    // 将订单中的v_amount v_moneytype v_oid v_mid v_url key六个参数的value值
    // 拼成一个无间隔的字符串(顺序不要改变)。参数key是商户的MD5密钥（该密匙可在登陆商户管理界面后自行更改。）
    var form = '<form method=post action="https://pay3.chinabank.com.cn/PayGate">\
            <input type="text" name=v_mid value="%s">\
            <input type="text" name=v_oid value="%s">\
            <input type="text" name=v_amount value="%s">\
            <input type="text" name=v_moneytype value="%s">\
            <input type="text" name=v_url value="%s">\
            <input type="text" name=v_md5info value="%s">\
            <input type=submit value="网银在线支付">\
            </form>';
    var sign = Z.md5(v_amount + v_moneytype + v_oid + v_mid + v_url + v_key).toUpperCase();
    form = Util.format(form , v_mid , v_oid , v_amount , v_moneytype , v_url , sign);
    return form;
}

function toChinaDate(date) {
    var localTime = date.getTime();//毫秒
    var localOffset = date.getTimezoneOffset()*60000; //获得当地时区偏移的毫秒数
    var utc = localTime + localOffset; //还原成utc时间

    var offset = 8; //中国，东+8区
    var time = utc + (3600000*offset);//时间毫秒
    return new Date(time);
}

function getPadStr(num) {
    return num > 10 ? num : '0'+num;
}

function getDateString(date) {
    return date.getFullYear()
        + '-' + getPadStr(date.getMonth()+1)
        + '-' + getPadStr(date.getDate())
        + ' ' + getPadStr(date.getHours())
        + ':' + getPadStr(date.getMinutes())
        + ':' + getPadStr(date.getSeconds());
}













function toDateStr(date) {
    return getDateString(toChinaDate(date));
}

exports.makeCapcha = makeCapcha;
exports.toDateStr = toDateStr;
exports.toChinaDate = toChinaDate;
exports.getDateString = getDateString;
exports.getPayForm = getPayForm;