/* 
* @Author: 陈文贵
* @Date:   2017-09-05 22:04:16
* @Last Modified by:   Marte
* @Last Modified time: 2017-09-08 21:43:50
*/
require(['config'],function(){
    require(['jquery'],function($){
        var $login_box = $('.login_box');
        var $mes_tip = $login_box.find('.mes_tip');
        var $input_menu = $('.input_menu');
        var $login_uname = $input_menu.find('#login_uname');
        var $login_pas = $input_menu.find('#login_pas');
        var $ver_code = $input_menu.find('#ver_code');
        var $ver_code_value = $input_menu.find('.ver_code_value');
        var $ver_code_btn = $input_menu.find('.ver_code_btn');
        var $login_btn = $login_box.find('.login_btn');
        //生成随机验证码
        function randomCode(num){
            num = num||4;
            var res = '';
            for(var i = 0;i<num;i++){
                var code = Math.floor(Math.random()*75)+48;
                if(code>57&&code<65||code>90&&code<97){
                    i--;
                    continue;
                }
                res+=String.fromCharCode(code);
            }
            return res;
        }
        $ver_code_value.text(randomCode());
        $ver_code_btn.click(function(){$ver_code_value.text(randomCode());});
        var checkCode = false;
        $ver_code.blur(function(){
            if(this.value.toLowerCase()===$ver_code_value.text().toLowerCase()){
                checkCode = true;
            }else{
                $mes_tip.text('您输入的验证码不正确！').css({visibility:'visible'});
                checkCode = false;
            }
        });
        $login_btn.click(function(){
            if(!checkCode){
                $mes_tip.text('您输入的验证码不正确！').css({visibility:'visible'});
            }else if($login_uname.val().trim()===''){
                $mes_tip.text('您输入的用户名为空！').css({visibility:'visible'});
            }else if($login_pas.val().trim()===''){
                $mes_tip.text('您输入的密码为空！').css({visibility:'visible'});
            }else{
                $mes_tip.css({visibility:'hidden'});
                $.ajax({
                    url:'../api/login.php',
                    data:{'username':$login_uname.val(),'password':$login_pas.val()},
                    type:'post',
                    success:function(res){console.log(res)
                        if(res==='ok'){
                            document.cookie = 'username='+$login_uname.val()+';path=/';
                            if(location.search.split('=')[1]==='reg'){
                                location.href = '../index.html';
                            }else{
                                history.back();
                            } 
                        }else{
                            $mes_tip.text('有户名和密码不匹配').css({visibility:'visible'});
                        }
                    }
                });
            }
        });
    });
});
