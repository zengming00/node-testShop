///////////////Copyright zengming QQ:243786753 2010-2017/////////////////////////////////////////////
///////////////    [MIT](LICENSE)   2017/01/18 21:19    /////////////////////////////////////////////
function str_replace(search, replace, str) {
    var old,rep;
    for(var i=0; i<search.length; i++){
        //rep = replace[i] ? replace[i] : '';
        rep = replace[i] || '';
        do{
            old = str;
            str = str.replace(search[i],rep);
        }while(str != old); //替换后的字符串与原字符串不同，表示发生了替换，但replace有可能只替换了一次
    }
    return str;
}
function isEmptyObject(e) {
    for (var t in e)  return false;
    return true;
}
//TODO index?name=vale   name没有过滤，有XSS风险
exports = module.exports = function Page(req, totalRows, listRows){
    var pageTag = "PAGE"; //url参数替换标记
    var p       = 'p'; //分页参数名
    var url     = req.originalUrl; //当前链接URL
    // 分页显示定制
    var config  = {
        'header': '<span class="rows">共 %TOTAL_ROW% 条记录</span>',
        'prev': '<<',
        'next': '>>',
        'first': '1...',
        'last': '...%TOTAL_PAGE%',
        'theme': '%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END%'
    };

    /* 基础设置 */
    this.rollPage   = 11;// 分页栏每页显示的页数
    this.lastSuffix = true; // 最后一页是否显示总页数
    this.totalRows  = totalRows; //设置总记录数
    this.listRows   = listRows || 20;  //设置每页显示行数
    this.nowPage    = req.query[p] ? (req.query[p]|0) : 1;
    this.nowPage    = this.nowPage>0 ? this.nowPage : 1;
    this.firstRow   = this.listRows * (this.nowPage - 1);// 起始行数  (可能由于get参数的影响导致起始行超过总行数，但不影响使用）

    if(url.indexOf('?') != -1){ //  "/page/haha?p=1234&a=1"
        url = url.substring(0,url.indexOf('?'))
    }
    url += '?';
    if(isEmptyObject(req.query)){
        url +=  p+"="+pageTag;
    }else{
        req.query[p]=pageTag;
        for(var i in req.query){
            url += i + "=" + encodeURIComponent(req.query[i]) + "&";
        }
    }

    /**
     * 定制分页链接设置
     * @param string $name  设置名称
     * @param string $value 设置值
     */
    this.setConfig = function setConfig($name,$value) {
        if(config[$name]) { config[$name] = $value; }
    }

    /**
     * 生成链接URL
     * @param  integer $page 页码
     * @return string
     */
    var makeUrl = function makeUrl($page){
        return url.replace(pageTag, $page);
    }

    /**
     * 组装分页链接
     * @return string
     */
    this.show = function show() {
        if(0 == this.totalRows) return '';

        /* 计算分页信息 */
        this.totalPages = Math.ceil(this.totalRows / this.listRows); //总页数
        if(this.totalPages && this.nowPage > this.totalPages) {
            this.nowPage = this.totalPages;
        }

        /* 计算分页临时变量 */
        var $now_cool_page      = this.rollPage/2;
        var $now_cool_page_ceil = Math.ceil($now_cool_page);
        if(this.lastSuffix){
            config['last'] = this.totalPages;
        }

        //上一页
        var $up_row  = this.nowPage - 1;
        var $up_page = $up_row > 0 ? '<a class="prev" href="' + makeUrl($up_row) + '">' + config['prev'] + '</a>' : '';

        //下一页
        var $down_row  = this.nowPage + 1;
        var $down_page = ($down_row <= this.totalPages) ? '<a class="next" href="' + makeUrl($down_row) + '">' + config['next'] + '</a>' : '';

        //第一页
        var $the_first = '';
        if(this.totalPages > this.rollPage && (this.nowPage - $now_cool_page) >= 1){
            $the_first = '<a class="first" href="' + makeUrl(1) + '">' + config['first'] + '</a>';
        }

        //最后一页
        var $the_end = '';
        if(this.totalPages > this.rollPage && (this.nowPage + $now_cool_page) < this.totalPages){
            $the_end = '<a class="end" href="' + makeUrl(this.totalPages) + '">' + config['last'] + '</a>';
        }

        //数字连接
        var $link_page = "";
        var $page = 0;
        for(var $i = 1; $i <= this.rollPage; $i++){
            if((this.nowPage - $now_cool_page) <= 0 ){
                $page = $i;
            }else if((this.nowPage + $now_cool_page - 1) >= this.totalPages){
                $page = this.totalPages - this.rollPage + $i;
            }else{
                $page = this.nowPage - $now_cool_page_ceil + $i;
            }
            if($page > 0 && $page != this.nowPage){
                if($page <= this.totalPages){
                    $link_page += '<a class="num" href="' + makeUrl($page) + '">' + $page + '</a>';
                }else{
                    break;
                }
            }else{
                if($page > 0 && this.totalPages != 1){
                    $link_page += '<span class="current">' + $page + '</span>';
                }
            }
        }

        //替换分页内容
        var $page_str = str_replace(
            ['%HEADER%', '%NOW_PAGE%', '%UP_PAGE%', '%DOWN_PAGE%', '%FIRST%', '%LINK_PAGE%', '%END%', '%TOTAL_ROW%', '%TOTAL_PAGE%'],
            [config['header'], this.nowPage, $up_page, $down_page, $the_first, $link_page, $the_end, this.totalRows, this.totalPages],
            config['theme']);
        return "<div class='page'>" + $page_str + "</div>";
    }
}
