var express = require('express');

var c = require('./common');
var getCats = c.getCats;
var router = express.Router();


router.get('/cart', getCats, function(req,res){
    res.render('flow/cart');
});

router.get('/checkout', getCats, function(req,res){
    res.render('flow/checkout');
});

router.get('/done', getCats, function(req,res){
    res.render('flow/done');
});


module.exports = router;
