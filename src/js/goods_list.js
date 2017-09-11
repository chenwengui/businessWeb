/* 
* @Author: 陈文贵
* @Date:   2017-09-05 22:05:16
* @Last Modified by:   Marte
* @Last Modified time: 2017-09-08 19:51:00
*/

require(['config'],function(){
    require(['jquery'],function($){
        require(['common'],function(){
            /*
               封装tab切换函数
                 三个参数【字符串】
                     分别是：tabs父和conts父的类名
                             以及tab聚焦的类名【默认值'g_on'】
            */
            function tabChange(tabC,contC,topParentC,cName){
                var cName = cName||'g_on';
                $('.'+tabC).children().hover(function(){
                    $this = $(this);
                    $this.addClass('g_on').siblings().removeClass('g_on');
                    if(topParentC===undefined){
                        var $conts = $this.parent().siblings('.'+contC);
                    }else{
                        var $conts = $this.closest('.'+topParentC).find('.'+contC);
                    }                   
                    $($conts.children().get($this.index())).show(0,function(){this.style.display = 'block';}).siblings().hide();
                });
            }

            /*=========right_bar========*/
            var $re_top = $('.re_top');
            $(document).scroll(function(){
                if($(this).scrollTop()>=100){
                    $re_top.css({visibility:'visible'});
                }else{
                    $re_top.css({visibility:'hidden'});
                }
            });
            $re_top.click(function(){
                $('html,body').animate({scrollTop:0});
            });

            /==========列表页==========/ 
            var goodType = location.search.split('=')[1];
            /*
                filter_box
             */
            var $hide_types = $('.fb_choose_types').find('li:gt(2)').hide();
            $('.fb_slide_btn').click(function(){
                var $this = $(this);
                if($this.hasClass('slide_up')){
                    $this.removeClass('slide_up').html('展开<i></i>');
                    $hide_types.hide();
                }else{
                    $this.addClass('slide_up').html('收起<i></i>');
                    $hide_types.show();
                }
            });

            /*
                goods_box
             */
            // 动态生成数据
            function createList(arr,$parent){
                var htmlStr = arr.map(function(item){
                    // var big_imgs_str = item.gl_b_imgs.map(function(item){
                    //     return `<a href="#"><img src="../img/${item}" alt="" /></a>`;
                    // }).join('');
                    // var small_imgs_str = item.small_imgs.map(function(item){
                    //     return `<a href="javascript:;"><img src="../img/${item}" alt="" /></a>`;
                    // }).join('');
                    return `<li data-goodId="${item.good_id}">
                                <div class="item_top">
                                    <div class="gl_big"><a href="good_details.html?good_id=${item.good_id}"><img src="../img/${item.gd_b_imgs}" alt="" /></a></div>  
                                    <div class="change_imgs">
                                        <span class="left_arror arror">&lt;</span>
                                        <div class="imgs g_clear"><a href="javascript:;"><img src="../img/${item.gd_s_imgs}" alt="" /></a></div>
                                        <span class="right_arror arror">&gt;</span>
                                    </div>
                                </div>
                                <ul class="item_bot">
                                    <li><span class="now_price">${item.price}</span><span class="old_price">${item.old_price}</span></li>
                                    <li>${item.text}</li>
                                    <li>已售出<span class="sale_num">${item.sale_num}</span>件</li>
                                    <li>尺码：<span>${item.sizes}</span></li>
                                    <a href="good_details.html?good_id=${item.good_id}"></a>
                                </ul>           
                            </li>
                    `;
                }).join('');
                $parent.html('');
                $('<ul class="g_clear"></ul>').html(htmlStr).appendTo($parent);     
            }
            function createPages(total,qty,$pageParent){ 
                var nums = Math.ceil(total/qty);
                var btnsStr = '';
                var classOn = ' class="g_on"';
                if(nums<=6){
                    for(var i = 0;i<nums;i++){
                        var addClass = i===0?classOn:'';
                        btnsStr+='<a href="javascript:void(0)"'+addClass+'>'+(i+1)+'</a>';
                    }
                }else{
                    //有省略号等情况
                }
                var htmlStr = `<a href="javascript:void(0)" class="pre_btn" style="display:none">上一页</a>
                            <p class="page_nums">
                                ${btnsStr}
                            </p>
                            <a href="javascript:void(0)" class="next_btn">下一页</a>`;

                $pageParent.html(htmlStr);
            }
            var $all_num = $('.find_num');
            var $parent = $('.goods_list');
            var $pageParent = $('.gp_cont');
            var arr =[];
            var initArr = [];
            var pageNo = 1;
            goodType = goodType||'type1';
            $.ajax({
                url:'../api/good_list.php',
                data:{'pageNo':pageNo,'qty':8,'type':goodType},
                success:function(res){
                    res = JSON.parse(res);
                    $all_num.text(res.total);
                    arr = res.data;
                    initArr = arr.slice();    
                    createList(arr,$parent);
                    createPages(res.total,res.qty,$pageParent);
                    hideBtn();
                }
            });
            // 排序
            $goods_sort_l = $('.goods_sort_l');
            $goods_sort_l.on('click','a',function(){
                $this = $(this);
                if($this.hasClass('default')){
                    $this.siblings().removeClass('down up').end().hide();
                    createList(initArr,$parent);
                }else if($this.hasClass('preice')){
                    $this.siblings().removeClass('up down').css({display:'block'});
                    if($this.hasClass('up')){
                        $this.removeClass('up').addClass('down');
                        arr.sort(function(obj1,obj2){return obj2.price-obj1.price;});
                        createList(arr,$parent);
                    }else{
                        $this.removeClass('down').addClass('up');
                        arr.sort(function(obj1,obj2){return obj1.price-obj2.price;});
                        createList(arr,$parent);
                    }
                }else{
                    $this.siblings().removeClass('up down').css({display:'block'});
                    if($this.hasClass('down')){
                        $this.removeClass('down').addClass('up');
                        arr.sort(function(obj1,obj2){return obj1.sale_num-obj2.sale_num;});
                        createList(arr,$parent);
                    }else{
                        $this.removeClass('up').addClass('down');
                        arr.sort(function(obj1,obj2){return obj2.sale_num-obj1.sale_num;});
                        createList(arr,$parent);
                    }
                }
            });
            //分页加载
            function hideBtn(){
                var $preBtn = $pageParent.find('.pre_btn').show();
                var $nextBtn = $pageParent.find('.next_btn').show();
                var len = $pageParent.find('.page_nums>a').length;
                var idx = $pageParent.find('.g_on').index();
                if(idx===0){
                    $preBtn.hide();
                }
                if(idx===len-1||len==1){
                    $nextBtn.hide();
                }
            };
            $pageParent.on('click','a',function(){
                var $this = $(this);
                if($this.hasClass('pre_btn')){
                    pageNo-=1;
                    $($pageParent.find('.page_nums>a').get(pageNo-1)).addClass('g_on').siblings().removeClass('g_on');
                    $.ajax({
                        url:'../api/good_list.php',
                        data:{'pageNo':pageNo,'qty':8,'type':goodType},
                        success:function(res){
                            res = JSON.parse(res);
                            $all_num.text(res.total);
                            arr = res.data;
                            initArr = arr.slice();    
                            createList(arr,$parent);
                            hideBtn();
                        }
                    });
                }else if($this.hasClass('next_btn')){
                    pageNo+=1;
                    $($pageParent.find('.page_nums>a').get(pageNo-1)).addClass('g_on').siblings().removeClass('g_on');
                    $.ajax({
                        url:'../api/good_list.php',
                        data:{'pageNo':pageNo,'qty':8,'type':goodType},
                        success:function(res){
                            res = JSON.parse(res);
                            $all_num.text(res.total);
                            arr = res.data;
                            initArr = arr.slice();    
                            createList(arr,$parent);
                            hideBtn();
                        }
                    });
                }else{
                    pageNo=$this.text()*1;
                    $($pageParent.find('.page_nums>a').get(pageNo-1)).addClass('g_on').siblings().removeClass('g_on');
                    $.ajax({
                        url:'../api/good_list.php',
                        data:{'pageNo':pageNo,'qty':8,'type':goodType},
                        success:function(res){
                            res = JSON.parse(res);
                            $all_num.text(res.total);
                            arr = res.data;
                            initArr = arr.slice();    
                            createList(arr,$parent);
                            hideBtn();
                        }
                    });
                }
            });
            //图片切换
            tabChange('imgs','gl_big','item_top');
        });
     });
});