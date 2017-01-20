var cat = require('../models/CatModel');

cat.find(function (err, rows) {
    /*
    for(var i in rows){
        var $row = rows[i];
        console.log('cat_name = ' + $row.cat_name)
        console.log('$row.parent_id = ' + $row.parent_id );
        console.log('_id = ' + $row._id);
        console.log('--')
    }
    return;
*/
    rows = cat.getTree(rows);
    console.log(rows);
    return;


    console.log(rows.length)
    console.log(rows[rows.length-1])
    console.log(typeof(rows[rows.length-1]._id))
    console.log(rows[rows.length-1].cat_name)
    console.log(rows[rows.length-1].parent_id)
})