var mongoose = require("./Common");
var Schema = mongoose.Schema;


var CatSchema = mongoose.Schema({
    cat_name: String,
    intro: String,
    parent_id: String
});

var CatModel = mongoose.model('cate', CatSchema);

exports = module.exports = CatModel;

CatModel.getTree = function getTree($rows, $pid, $level){
    $pid = $pid || 0;
    $level = $level || 0;

    var $tree = [];
    for (var k in $rows){
        var $row = $rows[k];
        if($row.parent_id == $pid){
            $tree.push({  //$row是模型实体对象无法添加level属性
                _id : $row._id,
                cat_name : $row.cat_name,
                intro : $row.intro,
                parent_id : $row.parent_id,
                level : $level
            });
            //if($row._id != $row.parent_id){
                $tree = $tree.concat(getTree($rows, $row._id, $level+1));
            //}
        }
    }
    return $tree;
 }

CatModel.getFamily = function getFamily($rows, $catid){
     var $arr =[], k, row;
     while($catid != 0){
         for(k in $rows){
             row = $rows[k];
             if(row._id == $catid){
                 $arr.unshift(row);
                 $catid=row.parent_id;
                 break;
             }
         }
     }
     return $arr;
 }