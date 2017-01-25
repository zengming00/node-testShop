var Z = require('zengming');
var Util = require('util');




function makeCapcha(req, res) {
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
    req.session.__verify = str;
    res.set('Content-Type', 'image/bmp');
    res.send(img.getFileData());
}

function verify(req, yzm) {
    if(req.session.__verify){
        if(req.session.__verify === yzm.toUpperCase()){
            req.session.__verify = null; //清空，防止多次使用
            return true;
        }
    }
    return false;
}

exports.verify = verify;
exports.makeCapcha = makeCapcha;
