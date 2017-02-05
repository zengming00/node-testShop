
function Cart(goods){
    this.goods = goods || [];
}

Cart.prototype.add = function add(id, name, img, price, num){
    var info = null;
    for(var i=0; i<this.goods.length; i++){
        if(this.goods[i].id === id){
            info = this.goods.splice(i, 1)[0];//返回的是一个数组
            break;
        }
    }
    if(info){
        info.num += num;
    } else {
        info = {id: id, name: name, img: img, price: price, num: num};
    }
    this.goods.unshift(info);//前插入
};

Cart.prototype.del = function del(id) {
    for(var i=0; i<this.goods.length; i++){
        if(this.goods[i].id === id){
            this.goods.splice(i, 1);
            break;
        }
    }
};

//获得商品总数量
Cart.prototype.getGoodsNum = function getGoodsNum() {
    var sum = 0;
    for(var i=0; i<this.goods.length; i++){
        sum += this.goods[i].num;
    }
    return sum;
};

//清空
Cart.prototype.clear = function clear() {
    this.goods = [];
};

//获得商品总价
Cart.prototype.getTotalMoney = function getTotalMoney() {
    var totalMoney = 0;
    for(var i=0; i<this.goods.length; i++){
        totalMoney += (this.goods[i].price * this.goods[i].num);
    }
    return this.floor(totalMoney);
};

Cart.prototype.floor = function floor(n) {
    return Math.floor(n*100)/100;//保留两位小数
}

Cart.prototype.incr = function incr(id) {
    for(var i=0; i<this.goods.length; i++){
        if(this.goods[i].id === id){
            this.goods[i].num++;
            break;
        }
    }
};

Cart.prototype.decr = function decr(id) {
    for(var i=0; i<this.goods.length; i++){
        if(this.goods[i].id === id){
            if(this.goods[i].num > 0){
                this.goods[i].num--;
            }
            break;
        }
    }
};

Cart.prototype.items = function items(id) {
    return this.goods;
};


/*
 var c = new Cart();
 c.add(1,'foo', 'none', 1.5, 3);
 c.add(2,'kitty', 'none', 0.8, 2);
 c.add(1,'foo', 'none', 1.5, 1);

 c.decr(2)
 c.decr(2)
 c.decr(2)
 c.decr(2)

 console.log(JSON.stringify(c.items(), null, 2));
 console.log(c.getGoodsNum());
 console.log(c.getTotalMoney());
 */

module.exports = Cart;