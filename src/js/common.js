/* 
* @Author: 陈文贵
* @Date:   2017-09-01 09:12:53
* @Last Modified by:   Marte
* @Last Modified time: 2017-09-09 11:03:27
*/

/*
    cookie
 */
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
    $('.login_reg').hide();
    $('.logined').show();
    $('#uname').text(username);
    $('#logout').click(function(){
        $('.login_reg').show();
        $('.logined').hide();
        var date = new Date();
        date.setDate(date.getDate()-99);
        document.cookie='username=;expires='+date+';path=/';
        location.reload(true);
    });

    /*
        公共购物车部分
     */
    /*=========页面顶部+右边 购物车========*/
    var isFull = false;//商品是否到达库存临界点

    function changeComCart(arr){
        arr = arr||cart_list;
        var cartAllNum = 0;
        var cartAllPrice = 0;
        var topCartListStr = '';
        topCartListStr = arr.map(function(item){
            var cartId = item.good_id+'&'+item.size;
            cartAllNum+=item.buy_num*1;
            cartAllPrice+=item.price*item.buy_num;
            return `<li data-goodId = ${cartId}>
                        <a href="good_details.html?good_id=${item.good_id}"><img src="../img/${item.gl_s_imgs}" alt="" /></a>
                        <p><a href="good_details.html?good_id=${item.good_id}"></a>${item.text} (尺码：${item.size})</p>
                        <span class="good_num">${item.buy_num}</span>
                        <div class="good_r"><span class="price">${item.price}</span><span class="delBtn">[删除]</span></div>
                    </li>
            `;
        });
        $('.rb_top strong').text(cartAllNum);
        var $topCartBox = $('.head_cart');
        $topCartBox.find('.cart_num').text(cartAllNum);
        $topCartBox.find('.total_price').text(cartAllPrice);
        var $topCartList = $topCartBox.find('.hd_cart_list');
        $topCartList.html(topCartListStr);
        if(cartAllNum===0){
            $('.cart_detail').css({visibility:'hidden'});
        }else{
            $('.cart_detail').css({visibility:'visible'});
        }
    }
    changeComCart();
    //删除购物单
    function delCart(arr,cartId){
        arr = arr || cart_list;
        arr.forEach(function(item,idx){
            if(cartId===(item.good_id+'&'+item.size)){
                arr.splice(idx,1);
                cart_list = arr;
                return;                  
            }
        });
        changeComCart(arr);
        var date = new Date();
        date.setDate(date.getDate()+7);
        document.cookie = 'cart_list='+JSON.stringify(arr)+';expires='+date.toUTCString()+';path=/';
    }
    $('.hd_cart_list').on('click','.delBtn',function(){
        delCart(cart_list,$(this).closest('li').attr('data-goodid'));
    });
}else{
    $('.login_reg').show();
    $('.logined').hide();


    //购物车部分
    $('.cart_detail').hide();  
    $('.cart_num').text(0);
    $('#rCart').find('strong').text(0);
    $('#rCart').find('p').hide();
}

