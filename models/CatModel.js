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
            //if($row._id != $row.parent_id){ //原本以为会死循环，但实际上不会出现
                $tree = $tree.concat(getTree($rows, $row._id, $level+1));
            //}
        }
    }
    return $tree;
 }

CatModel.getFamily = function getFamily($rows, $catid){
     var $arr =[], k, row, isFind;
     while($catid != 0){
         isFind = false;
         for(k in $rows){
             row = $rows[k];
             if(row._id.toString() == $catid){
                 $arr.unshift(row);
                 $catid=row.parent_id;
                 isFind = true;//避免死循环
                 break;
             }
         }
         if(!isFind) break;
     }
     return $arr;
 }

 CatModel.getChildCates = function getChilds($rows, $catid) {
     var arr = [], k, r;
     for(k in $rows){
         r = $rows[k];
         if(r.parent_id == $catid){
             arr.push(r._id.toString());
             arr = arr.concat(getChilds($rows, r._id));
         }
     }
     return arr;
 }