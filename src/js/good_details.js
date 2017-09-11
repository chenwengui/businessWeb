/* 
* @Author: 陈文贵
* @Date:   2017-09-01 10:51:04
* @Last Modified by:   Marte
* @Last Modified time: 2017-09-09 10:54:13
*/
require(['config'],function(){
    require(['jquery'],function($){
        require(['../lib/jquery.fly.min','../lib/lxzoom','common'],function(){
            /*
                公用：
             */
            /*
               封装tab切换函数
                 三个参数【字符串】
                     分别是：tabs父和conts父的类名
                             以及tab聚焦的类名【默认值'g_on'】
            */
            function tabChange(tabC,contC,topParentC,cName,cb){
                var cName = cName||'g_on';
                $('.'+tabC).children().click(function(){
                    $this = $(this);
                    $this.addClass('g_on').siblings().removeClass('g_on');
                    if(topParentC===undefined){
                        var $conts = $this.parent().siblings('.'+contC);
                    }else{
                        var $conts = $this.closest('.'+topParentC).find('.'+contC);
                    }                   
                    $($conts.children().get($this.index())).show(0,function(){this.style.display = 'block';}).siblings().hide();
                    if(cb){
                       cb($($conts.children().get($this.index()))); 
                    }    
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
            
           
            /*
                详情页：
             */
            //接收列表页商品id，从后台获取数据，并生成html结构
            var good_id = location.search.split('=')[1];
            var $details_box = $('.details_box');
            var $db_left_items = $details_box.find('.db_left_items');
            var $db_right_mes = $details_box.find('.mes');
            var $db_right_buy_box = $details_box.find('.buy_box');
            var $bot_cart = $('.bot_cart');
            var last_num = 0;
            function createGoodDetail(obj){
                last_num = obj.last_num;
                $('.db_right_good_text').text(obj.text);
                var imgContsStr = obj.gl_b_imgs.split('、').map(function(item){
                    return '<a href="#" class="bigPic lxzoom"><img src="../img/'+item+'" alt="" data-big="../img/'+item+'"/></a>';
                }).join('');
                var img_tabs_str = obj.gl_s_imgs.split('、').map(function(item,idx){
                    var className = idx===0?"g_on":"";
                    return '<li class="'+className+'"><img src="../img/'+item+'" alt="" /><span></span></li>';
                }).join('');
                var dbLeftStr = `<div class="imgConts">
                                    ${imgContsStr}
                                </div>  
                                <ul class="img_tabs g_clear">
                                    ${img_tabs_str}
                                </ul>`;
                $db_left_items.html(dbLeftStr);
                var discount = (obj.price/obj.old_price).toFixed(1);
                var save = obj.old_price - obj.price;
                var dbRightMesStr = ` 
                            <li><strong>吊牌价：</strong><del>${obj.old_price}</del></li>
                            <li><strong>销售价：</strong><span class="price">${obj.price}</span><span class="discount">${discount}</span><span class="save">${save}</span></li>
                            <li><strong>好评度：</strong><i></i><span class="score">5</span>(<a href="#" class="appra_num">5</a>)</li>
                            <li><strong><b>运</b>费：</strong><span>名鞋库会员满399包邮  ( 不包括货到付款 )</span></li>
                `;
                $db_right_mes.html(dbRightMesStr);
                var sizesStr = obj.sizes.split('、').map(function(item){
                    return '<span>'+item+'<i></i></span>';
                }).join('');
                var db_right_buy_boxStr = `
                        <ul class="buy_choice">
                            <li class="g_clear size_choice"><strong>尺码：</strong>
                                ${sizesStr}
                            </li>
                            <li class="g_clear color_choice"><strong>颜色：</strong>
                                <div class="gd_item_colors g_clear">
                                    <span class="g_on"><img src="../img/${obj.gd_s_imgs}" alt="" /><i></i></span>
                                </div>  
                            </li>
                            <li class="g_clear num_choice"><strong>购买数量：</strong>
                                <span class="decrease"></span>
                                <input type="text" value="1" class="gd_num">
                                <span class="increase"></span>
                            </li>
                            <div class="gd_house"></div>
                            <img src="../img/cimaIcon.gif" alt="" class="gd_conversion"/>
                        </ul>
                        <div class="buy_btns g_clear">
                            <p class="g_fl">您将购买<span class="num"></span>件<span class="size"></span><span class="text" style="display:none">码</span><span class="color"></span></p>
                            <div class="g_fr"><span class="add_cart"></span></div>
                        </div>
                `;
                $db_right_buy_box.html(db_right_buy_boxStr);
                var botCartStr = `
                    <div class="w990 g_clear">
                        <div class="bot_cart_l">
                            <strong>尺码：</strong>
                            ${sizesStr}
                        </div>
                        <div class="bot_cart_r">
                            <strong>数量：</strong>
                            <span class="bc_decrease"></span>
                            <input type="text" value="1" class="bc_num">
                            <span class="bc_increase"></span>
                            <p>${obj.last_num}</p>
                            <a href="javascript:void(0)" class="add_cart"></a>
                        </div>
                    </div>
                `;
                $bot_cart.html(botCartStr);
            }
            $.ajax({
                url:'../api/good_detail.php',
                data:{'id':good_id},
                success:function(res){
                    res = JSON.parse(res);
                    createGoodDetail(res);
                    doAfterLoad();
                }
            });

            function doAfterLoad(){
                /*===========加入购物车============*/
                var $add_cart = $('.add_cart');
                function addCart(){
                    var $size = $('.size_choice').find('.g_on');
                    var isIn = cart_list.some(function(item){
                        if(item.good_id==good_id){
                            if(item.size==$size.text()){
                                return true;
                            }                      
                        }
                    });
                    if(isIn){
                        cart_list.forEach(function(item){
                            if(item.good_id == good_id){
                                if(item.size==$size.text()){
                                    item.buy_num += $num_input.val()*1;
                                }                             
                            }
                        });
                    }else{
                        var cartObj = {};
                        cartObj.good_id = good_id;
                        cartObj.buy_num = $num_input.val()*1;
                        cartObj.text = $('.db_right_good_text').text();
                        cartObj.size = $size.text();
                        cartObj.last_num = last_num;
                        cartObj.old_price = $('.mes del').text()*1;;
                        cartObj.price = $('.mes .price').text()*1;
                        cartObj.gl_s_imgs = $('.img_tabs').find('.g_on img').attr('src').replace('../img/','');
                        cart_list.unshift(cartObj);
                    }
                    changeComCart(cart_list);
                    var date = new Date();
                    date.setDate(date.getDate()+7);
                    document.cookie = "cart_list="+JSON.stringify(cart_list)+";expires="+date.toUTCString()+";path=/";
                    var buyAll = $num_input.val()*1;
                    cart_list.forEach(function(item){
                        if(item.good_id===good_id){
                            buyAll+=item.buy_num;
                        }
                    });
                    if(buyAll>=last_num*1+1){
                        isFull = true;
                        $('.add_cart').css({cursor:'not-allowed'});
                        return;
                    }     
                }
                //飞入购物车效果
                function flyToCart(e,cb){
                    var x = e.originalEvent.x || e.originalEvent.layerX;
                    var y = e.originalEvent.y || e.originalEvent.layerY;
                    var targetX = $(window).width()-$('#rCart').width();
                    var targetY = $('#rCart').position().top;
                    var $img = $('.img_tabs .g_on img').clone().appendTo(document.body).css({position:'fixed',"z-index":99999,top:y,left:x,width:'30px',height:'40px'});
                    $img.fly({
                        start:{left:x,top:y},
                        end:{left:targetX+10,top:targetY+10,width:0,height:0},
                        onEnd:function(){$img.remove();if(cb){cb()};}
                    });
                }
                $add_cart.click(function(e){
                    if(!username){alert('请先登录');return;}
                    if(isFull){alert('该商品库存不足;库存仅'+last_num+'件');return;}
                    var $size = $('.size_choice').find('.g_on');
                    if(!$size.length){alert('请先选择商品尺码');return;}
                    flyToCart(e,addCart);
                });


                /*===========底部bot_cart============*/
                var $bot_cart = $('.bot_cart');
                $(document).scroll(function(){
                    if($(this).scrollTop()>=1000){
                        $bot_cart.css({display:'block'});
                    }else{
                        $bot_cart.css({display:'none'})
                    }
                });

                /*
                    购物信息选项同步
                 */
                function changeSize(idx){
                    $($('.bot_cart_l').find('span').get(idx)).addClass('g_on').siblings('span').removeClass('g_on');
                    $($('.size_choice').find('span').get(idx)).addClass('g_on').siblings('span').removeClass('g_on');
                }
                $('.bot_cart_l').on('click','span',function(){
                    changeSize($(this).index()-1);
                    showBuyMes();
                });
                var $bot_cart_r = $('.bot_cart_r');
                var $bc_num_input = $bot_cart_r.find('input');
                $bot_cart_r.on('click','span',function(){ 
                    var step_num = this.className==='bc_increase'?1:-1;
                    var new_num = $bc_num_input.val()*1 + step_num;
                    if(new_num<=0){new_num=1;}
                    if(new_num>last_num){new_num = last_num;alert('该商品库存仅'+last_num+'件')}
                    $bc_num_input.val(new_num);
                    $num_input.val(new_num);
                    showBuyMes();
                });
                $bc_num_input[0].disabled = true;

                /*============details_box===========*/
                // 左侧商品切换
                function forLxz($ele){
                    $ele.addClass('lxzoom').siblings().removeClass('lxzoom');
                    new LxZoom({width:560,height:400,position:'right'}).init();
                }
                tabChange('img_tabs','imgConts','db_left_items','g_on',forLxz);
                
                //左侧放大镜
                new LxZoom({width:560,height:400,position:'right'}).init();


                // 右侧信息改动响应
                var $buy_box = $('.buy_box');
                var $buy_choice = $buy_box.find('.buy_choice');
                var $size_choice = $buy_choice.find('.size_choice');
                var $color_choice = $buy_choice.find('.color_choice');
                var $num_choice = $buy_choice.find('.num_choice');
                var $num_input = $num_choice.find('input');

                var $buy_btns = $buy_box.find('.buy_btns');
                //$p：信息汇总与实时更新
                var $p = $buy_box.find('p');
                var $p_num = $p.find('.num');
                var $p_size = $p.find('.size');
                var $p_text = $p.find('.text');
                var $p_color = $p.find('.color');
                // var color_arr = ['黑色','白色'];//接收动态数据
                function showBuyMes(){
                    $p_num.text($num_input.val());
                    if($size_choice.find('.g_on').length){
                        $p_text.show();
                        $p_size.text($size_choice.find('.g_on').text());
                    }
                    var idx = $('.gd_item_colors').find('.g_on').index();
                    // $p_color.text(color_arr[idx]);
                };
                showBuyMes();
                // 切换左侧商品
                tabChange('gd_item_colors','db_left_items','details_box','g_on',showBuyMes);

                $size_choice.on('click','span',function(){
                    changeSize($(this).index()-1);
                    showBuyMes();
                });
                $num_choice.on('click','span',function(){ 
                    var step_num = this.className==='increase'?1:-1;
                    var new_num = $num_input.val()*1 + step_num;
                    if(new_num<=0){new_num=1;}
                    if(new_num>last_num){new_num = last_num;alert('该商品库存仅'+last_num+'件')}
                    $num_input.val(new_num);
                    $bc_num_input.val(new_num);
                    showBuyMes();
                });
                $num_input.keydown(function(e){
                    if((e.keyCode<48||e.keyCode>57)&&e.keyCode!==8&&e.keyCode!==37&&e.keyCode!==39){
                        return false;
                    }
                    $bc_num_input.val($num_input.val());
                    showBuyMes();
                });
                $num_input.on('input',function(){
                    var new_num = $num_input.val()*1;
                    if(new_num<=0||isNaN(new_num)){$num_input.val(1);$num_input.val(1);return;};
                    if(new_num>last_num){new_num = last_num;alert('该商品库存仅'+last_num+'件')}
                    $num_input.val(new_num);
                    $bc_num_input.val(new_num);
                    showBuyMes();
                });
                // $num_input.blur(function(){
                //     if(isNaN($num_input.val()*1)){$num_input.val(1);}
                // });
                

                //右侧飞入购物车效果

                /*============tab_box===========*/
                tabChange('tb_tabs','tb_conts');
            }
        });
    });
});
