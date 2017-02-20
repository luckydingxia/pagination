;(function(win, $, undefined){
    /*
    先根据传进来的参数初始化，构建分页列表；
    然后点击分页，
    1、先判断是不是，下一页或者上一页，有没有disabled或者active类，如果有，return false;
    2、如果都不是，获取当前要点击的数据page,然后重写UL里面的东东
    */

    'use strict';

    var old = $.fn.pagination;

    var Pagination = function (element, options){

        this.$element = $(element);
        this.options = $.extend({}, $.fn.pagination.options, options );

        this.options.totalPages = parseInt( this.options.totalPages );
        if( isNaN(this.options.totalPages) ){
            throw new Error("请输入正确的总页码");
        }

        this.options.visiblePages = parseInt( this.options.visiblePages );
        if( isNaN(this.options.visiblePages) ){
            throw new Error("请输入正确的显示页码数量");
        }

        if( this.options.visiblePages > this.options.totalPages ){
            this.options.visiblePages = this.options.totalPages; 
        }

        if( this.options.onClickPage instanceof Function ){
            this.$element.first().on('page', this.options.onClickPage );
        }

        this.show(this.options.currentPage);

        return this;

    }

    Pagination.prototype = {
        constructor: Pagination,

        show: function( page ){         //应该显示的排序
            if(isNaN(page)){
                throw new Error("请输入正确的要显示的页码");  
            }

            this.init(page);
            this.setupEvent();
            this.$element.trigger('page',page);             //触发page事件
            
            return this;
            
        },

        init: function(page){      
            this.$element.children().remove();

            var appendHtml = this.buildAllItem( page ),
                len        = appendHtml.length,
                _this      = this;                 //for jQuery.each

            $.each(appendHtml,function(index, item){
                _this.$element.append( item );
            });

            _this.$element.children().each(function(){
                var $this    = $(this),
                    pageType = $this.data("page-type");

                switch(pageType){
                    case "prev" :
                        $this.addClass("prev");
                        if( $this.data("page") === 1 && page === 1 )
                        {
                            $this.addClass("disabled");
                        }
                        break;
                    case "page" :
                        if( $this.data("page") === page ){
                           $this.addClass("active"); 
                        } 
                        break;
                    case "next" :
                        $this.addClass("next");
                        if( $this.data("page") === _this.options.totalPages && page === _this.options.totalPages ){
                            $this.addClass("disabled");
                        }
                        break;
                    default: 
                        break;
                }
            });

        },

        buildAllItem: function( page ){
            var addHtml = [];         

            if(this.options.prev){
                var prev = page > 1 ? page - 1 : 1;
                addHtml.push(this.buildItem('prev',prev));
            }

            var pageList = this.getPageList(page);
            for(var i = 0; i < this.options.visiblePages; i++){
                addHtml.push( this.buildItem( "page", pageList[i] ) );
            }

            if(this.options.next){
                var next = page < this.options.totalPages ? page + 1 : this.options.totalPages;
                addHtml.push(this.buildItem('next',next));
            }

            return addHtml;
        },

        getPageList: function( currentPage ){
            var list = [];

            var half = Math.floor( this.options.visiblePages / 2 );

            var start = currentPage - half + 1 - this.options.visiblePages%2;
            var end = currentPage + half;

            if(start <= 0){
                start = 1;
                end = this.options.visiblePages;
            }

            if( end > this.options.totalPages ){
                end = this.options.totalPages;
                start = this.options.totalPages - this.options.visiblePages + 1;
            }

            var itPage = start;
            while (itPage <= end) {
                list.push(itPage);
                itPage++;
            }

            return list;
        },

        buildItem: function( text, page){ 
            var _this = this;
            var $li   = $('<li></li>'),    
                $a    = $('<a></a>'),
                aText = this.options[text] ? this.options[text] : page;

            $li.data("page",page);          //写入数据page，方便之后进行下一页操作
            $li.data("page-type",text);         
            $li.append( $a.attr("href", this.options.href).html(aText) );

            return $li;
        },

        setupEvent: function(){
            var _this = this;
            _this.$element.off('click').on("click","li",function(){
                var $this = $(this);
                if( $this.hasClass("disabled") || $this.hasClass("active") ){
                    return false;
                }

                _this.show( parseInt( $this.data("page") ) );    
            })

        }
    };

    $.fn.pagination = function (options){
        var $this = $(this),
            data = $this.data("pagination");

        if(!data) $this.data("pagination", (data = new Pagination(this, options) ) );

    };

    //默认参数
    $.fn.pagination.options = {
        totalPages : 10,
        currentPage: 1,
        visiblePages: 10,
        prev: "上一页",
        next: "下一页",
        href: "javascript:;",
        onClickPage: null
    }

    $.fn.pagination.Constructor = Pagination;

    $.fn.pagination.noConflict = function () {
        $.fn.twbsPagination = old;
        return this;
    };

})(window, jQuery);






