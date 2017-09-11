/* 
* @Author: 陈文贵
* @Date:   2017-09-01 10:49:36
* @Last Modified by:   Marte
* @Last Modified time: 2017-09-09 11:43:42
*/

require(['config'],function(){
    require(['jquery'],function($){
        //获取元素
        $reg = $('.reg_main_l');
        $tip = $reg.find('.mes_tip');
        $input_menu = $reg.find('.input_menu');
        $reg_uname = $reg.find('#reg_uname');
        $reg_pas = $reg.find('#reg_pas');
        $reg_compas = $reg.find('#reg_compas');
        $ver_code = $reg.find('#ver_code');
        $ver_code_value = $reg.find('.ver_code_value');
        $ver_code_btn = $reg.find('.ver_code_btn');
        $isAgree = $reg.find('#isAgree');
        $reg_new = $reg.find('.reg_new');

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
        //进行验证
        var checkArr = [false,false,false,false,true];
        function checkMes(num){
            num = num||4;
            if(!checkArr[0]){
                $tip.text('请输入正确的邮箱账号或手机!').css({visibility:'visible'});
                if(num===1){return;}
            }
            if(!checkArr[1]){
                $tip.text('您输入的密码不能小于4个字符!').css({visibility:'visible'});
                if(num===2){return;}
            }
            if(!checkArr[2]){
                $tip.text('您两次输入的密码不一致!').css({visibility:'visible'});
                if(num===3){return;}
            }
            if(!checkArr[3]){
                $tip.text('您输入的验证码不正确').css({visibility:'visible'});
            }
        }  
        var reg_phone = /^1[34578]\d{9}$/;
        var reg_email = /^[0-9a-zA-Z_\-\.]+@[0-9a-zA-Z_]+(\.[a-z]{2,4})+$/;
        $input_menu.on('blur','input',function(){
            var val = $(this).val();
            switch(this.id){
                case 'reg_uname':
                        $.ajax({
                            url:'../api/registed.php',
                            data:{'username':$reg_uname.val()},
                            success:function(res){
                                if(res==='fail'){
                                    $tip.text('该用户名已存在！').css({visibility:'visible'});
                                }else{
                                   if(reg_phone.test(val)||reg_email.test(val)){
                                       checkArr[0] = true;
                                       $tip.css({visibility:'hidden'});
                                   }else{
                                       checkArr[0] = false;
                                       checkMes(1);
                                   } 
                                }
                            }
                        });           
                        break;
                case 'reg_pas':
                        if(val.trim().length>4){
                            checkArr[1] = true;
                            $tip.css({visibility:'hidden'});
                        }else{
                            checkArr[1] = false;
                            checkMes(2);
                        }
                        break;
                case 'reg_compas':
                        if(checkArr[1]&&val===$reg_pas.val()){
                            checkArr[2] = true;
                            $tip.css({visibility:'hidden'});
                        }else{
                            checkArr[2] = false;
                            checkMes(3);
                        }
                        break;
                case 'ver_code':
                        if(val.toLowerCase()===$ver_code_value.text().toLowerCase()){
                            checkArr[3] = true;
                            $tip.css({visibility:'hidden'});
                        }else{
                            checkArr[3] = false;
                            checkMes(4);
                        }
                        break;
            }
        });
        $isAgree.click(function(){
            checkArr[4] = this.checked;
            if(checkArr[4]){
                $reg_new.css({cursor:'pointer'});
                $tip.css({visibility:'hidden'});
            }else{
                $reg_new.css({cursor:'not-allowed'});
            }
        });
        $reg_new.click(function(){
            if(!checkArr[4]){
                $tip.text('您还没同意注册条款').css({visibility:'visible'});
                return;
            }
            if(checkArr.every(function(item){return item;})){
                $.ajax({
                    url:'../api/registed.php',
                    data:{'username':$reg_uname.val(),'password':$reg_pas.val()},
                    success:function(res){console.log(res)
                        if(res==='success'){
                            document.cookie = 'username='+$reg_uname.val()+';path=/';
                            location.href = '../index.html';
                        }
                    }
                });
            }else{
                checkMes(4);
            }
        });
    });
});