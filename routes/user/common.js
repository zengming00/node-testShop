var catModel = require('../../models/CatModel');


function getCats(req, res, next) {
    catModel.find(function (err, docs) {
        if(err) return next(err);
        console.log('----------getCats()------------------------------------------------------');
        res.locals.tree = catModel.getTree(docs);
        next();
    });
};


exports.getCats = getCats;