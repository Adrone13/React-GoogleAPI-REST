<?php

require_once('DB.php');

$host = 'localhost';
$db_name = 'my-project';
$username = 'root';
$password = '8246';

$db = new DB($host, $db_name, $username, $password);

if ($_SERVER['REQUEST_METHOD'] == "GET") {

    if ($_GET['url'] == "coordinates") {
        $coordinatesArray = array_values($db->query("SELECT * FROM coordinates"));

        header('Content-type: application/json');
        
        echo json_encode($coordinatesArray);
        http_response_code(200);
    } else if ($_GET['url'] == "loads") {
        $loads = array_values($db->query("SELECT * FROM loads"));
        $coordinatesArray = array_values($db->query("SELECT * FROM coordinates"));

        foreach ($loads as $key => $value) {
            $loads[$key]['coordinates'] = [];
            
            foreach ($coordinatesArray as $coordKey => $coordValue) {
                if ($coordValue['object_id'] === $value['id']) {
                    array_push($loads[$key]['coordinates'], $coordValue);
                }
            }
        }

        header('Content-type: application/json');
        echo json_encode($loads);
        http_response_code(200);
    } else {
        http_response_code(404);
        echo "Not Found";
    }
} else {
    http_response_code(405);
    echo "Method not allowed";
}
