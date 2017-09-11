/* 
* @Author: 陈文贵
* @Date:   2017-09-05 22:05:57
* @Last Modified by:   Marte
* @Last Modified time: 2017-09-08 21:30:48
*/

require(['config'],function(){
    require(['jquery'],function($){

        //应该根据用户id获取该用户购物车列表【先用本地cookie】
        var username = '';
        var cart_list = [];//应该根据用户id获取该用户购物车列表【先用本地cookie】
        var cookies = document.cookie;
        if(cookies.length>0){
            cookies = cookies.split('; ');
            cookies.forEach(function(item){
                var arr = item.split('=');
                if(arr[0]==='cart_list'){
                    cart_list = JSON.parse(arr[1]);
                }
                if(arr[0]==='username'){
                    username = arr[1];
                }
            });
        }
        /*
            登录部分
         */
        if(username){
            $('#logout').show();
            $('#uname').html(username);
            $('#logout').click(function(){
                $('#uname').html('<a href="login.html" style="color:#FF6600;">请先登录</a>');
                var date = new Date();
                date.setDate(date.getDate()-99);
                document.cookie='username=;expires='+date+';path=/';
                location.href = '../index.html';
            });
        }else{
            $('#logout').hide();
            $('#uname').html('<a href="login.html" style="color:#FF6600;">请先登录</a>');
        }
        //删除购物单
        function delCart(cartId,func,arr){
            arr = arr || cart_list;
            arr.forEach(function(item,idx){
                if(cartId===(item.good_id+'&'+item.size)){
                    arr.splice(idx,1);
                    cart_list = arr;
                    return;
                }
            });
            func(arr);
            var date = new Date();
            date.setDate(date.getDate()+7);
            document.cookie = 'cart_list='+JSON.stringify(arr)+';expires='+date.toUTCString()+';path=/';
        }
        //增减购物单数量
        function changeCartNum(cartId,num,arr){
            arr = arr || cart_list;
            arr.forEach(function(item,idx){
                if(cartId===(item.good_id+'&'+item.size)){
                    item.buy_num*=1;
                    item.buy_num+=num;console.log(item.buy_num,num)
                    if(item.buy_num<=0){
                        item.buy_num=1;
                    }
                    if(item.buy_num>item.last_num){
                        item.buy_num = item.last_num;
                        alert('该商品库存不足；库存仅'+item.last_num+'件');
                    }
                }
            });
            createCarts(arr);
            cart_list = arr;
            var date = new Date();
            date.setDate(date.getDate()+7);
            document.cookie = 'cart_list='+JSON.stringify(cart_list)+';expires='+date.toUTCString()+";path=/";
        }
        //生成购物车html结构
        var $cart_list = $('.cart_list');
        var $cart_all = $('.cart_all');
        function createCarts(arr){
            var arr = arr||cart_list;
            var allNum = 0;
            var allPrice = 0;
            var cartListStr = cart_list.map(function(item){
                allNum+=item.buy_num*1;
                allPrice+=item.buy_num*item.price;
                var itemDiscount = item.buy_num*(item.old_price-item.price);
                var itemPrice = item.buy_num*item.price;
                return `
                    <li data-goodid="${item.good_id}&${item.size}">
                            <a href="good_details.html?good_id=${item.good_id}" class="pho"><img src="../img/${item.gl_s_imgs}" alt="" /><img class="for_show" src="../img/${item.gl_s_imgs}" alt="" /></a>
                            <a class="des" href="good_details.html?good_id=${item.good_id}">${item.text}<span class="details">( 尺码:${item.size})</span></a>
                            <span class="points">0</span>
                            <span class="price">${item.price}</span>
                            <span class="num"><span class="reduce"></span><input type="text" value="${item.buy_num}" /><span class="add"></span></span>
                            <span class="save">${itemDiscount}</span>
                            <span class="total">${itemPrice}</span>
                            <a class="house" href="javascript:void(0)"><span>收藏</span><span class="del" href="javascript:void(0)">删除</span></a>
                        </li>
                `;
            });
            $cart_list.html(cartListStr);
            $cart_all.find('.all_num').text(allNum);
            $cart_all.find('.all_price').text(allPrice);
            //改变购物数量
            var $num = $cart_list.find('.num input').prop('disabled','true');
            var $adds = $cart_list.find('.num .add');
            var $reduces = $cart_list.find('.num .reduce');
            $adds.click(function(){
                var cartId = $(this).closest('li').attr('data-goodid');
                changeCartNum(cartId,1,cart_list);
            });
            $reduces.click(function(){
                var cartId = $(this).closest('li').attr('data-goodid');
                changeCartNum(cartId,-1,cart_list);
            });
        }
        createCarts();
        

        //鼠标移入移出商品图片效果
        $cart_list.on('mouseenter','.pho',function(){$(this).find('.for_show').fadeIn(200)});
        $cart_list.on('mouseleave','.pho',function(){$(this).find('.for_show').fadeOut(20)});
        //删除购物单
        $cart_list.on('click','.del',function(){
            var cartId = $(this).closest('li').attr('data-goodid');
            delCart(cartId,createCarts);
        });
        
    });
});