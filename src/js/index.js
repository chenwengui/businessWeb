/* 
* @Author: 陈文贵
* @Date:   2017-09-01 10:49:36
* @Last Modified by:   Marte
* @Last Modified time: 2017-09-08 20:11:09
*/

require(['config'],function(){
    require(['jquery'],function($){
        require(['common'],function(){
            $('.hd_cart_list').find('img').map(function(idx,item){item.src = item.src.replace('img/','src/img/')});
            $('.hd_cart_list').find('a').map(function(idx,item){item.href = item.href.replace('src/','src/html/');});
            $(function(){
            /*
               封装tab切换函数
                 三个参数【字符串】
                     分别是：tabs父和conts父的类名
                             以及tab聚焦的类名【默认值'g_on'】
            */
            function tabChange(tabC,contC,cName){
                var cName = cName||'g_on';
                $('.'+tabC).children().hover(function(){
                     $this = $(this);
                     $this.addClass('g_on').siblings().removeClass('g_on');
                     var $cont = $($this.parent().siblings('.'+contC).children().get($this.index()));
                     $cont.show().siblings().hide();
                });
            }

            // rotation_column：轮播图
            //初始化
            var index = 0;
            $rotation_column = $('.rotation_column');
            $ratation_imgs = $rotation_column.find('.ratation_imgs');
            $ratation_imgs_children = $ratation_imgs.children();
            $racation_nav_icons = $rotation_column.find('.racation_nav_icons');
            $($ratation_imgs_children.fadeOut().get(index)).fadeIn();
            //定义淡入淡出动画函数
            function ratationAnimate(index){
                $ratation_imgs_children.stop(true);
                $($ratation_imgs_children.get(index)).siblings().fadeOut().end().fadeIn(1000);
                $($racation_nav_icons.children().get(index)).addClass('g_on').siblings().removeClass('g_on');
            }
            //定义自动动画函数
            function autoRatation(){
                index++;
                if(index>=$ratation_imgs_children.length){
                    index = 0;
                }
                ratationAnimate(index);
            }
            //用定时器实现自动：淡入淡出
            var timer = setInterval(autoRatation,3000);
            //鼠标移入/移出时 停止/开始
            $rotation_column.mouseover(function(){clearInterval(timer);}).mouseout(function(){
                timer = setInterval(autoRatation,3000);
            });
            //悬浮小图标时：淡入淡出
            $racation_nav_icons.on('mouseover','li',function(){
                index = $(this).index();
                ratationAnimate(index);
            });
            
            
            
            // brand_column：tab切换
            tabChange('content_tags','content_imgs');
           

            //hot_column：tab切换
            tabChange('hot_item_c','hot_item_r');
           // $('.hot_item_c').children().hover(function(){
           //      $this = $(this);
           //      $this.addClass('g_on').siblings().removeClass('g_on');
           //      var $cont = $($this.parent().siblings('.hot_item_r').children().get($this.index()));
           //      $cont.show().siblings().hide();
           // });   
        });
        });
        
    });
});