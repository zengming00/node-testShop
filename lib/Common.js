var Z = require('zengming');
var Util = require('util');




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


exports.getPayForm = getPayForm;