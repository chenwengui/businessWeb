<?php
    /*
        sql语句返回值
            * select : 数据
            * insert : true/false
            * delect : true/false
            * update : true/false
     */
    include 'connect.php';
    
    $username = isset($_GET['username']) ? $_GET['username'] : '';
    $password = isset($_GET['password']) ? $_GET['password'] : '';

    //查看用户名是否已经存在
    $sql = "select username from user where username='$username'";
    $result = $conn->query($sql);

    // 如果用户名已经存在
    // 给前端返回一个fail
    if($result->num_rows>0){
        echo "fail";
    }else{
        if($password !== ''){
            // 密码md5加密
            $password = md5($password);

            $sql = "insert into user (username,password) values('$username','$password')";


            // 获取查询结果
            $result = $conn->query($sql);
            if ($result) {
                echo "success";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }   
    }

    
    

    // 释放查询内存(销毁)
    //$result->free();

    //关闭连接
    $conn->close();
?>