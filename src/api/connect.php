<?php

    // 配置参数
    $servername = 'localhost';
    $username = 'root';
    $password = '';
    $database = 'first_project';

    //连接数据库
    $conn = new mysqli($servername,$username,$password,$database);

    // 检测连接
    if($conn->connect_errno){
        die('连接失败'.$conn->connect_error);
    }
    // echo 'success';
    // 设置编码
    $conn->set_charset('utf8');

?>