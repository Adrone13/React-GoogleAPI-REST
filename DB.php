<?php

class DB {

    private $pdo;

    public function __construct($host, $db_name, $username, $password) {
        $pdo = new PDO("mysql:host={$host};dbname={$db_name}", $username, $password);

        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo = $pdo;
    }

    function query($query, $params = array()) {
        $statement = $this->pdo->prepare($query);
        $statement->execute($params);

        if (explode(' ', $query)[0] == 'SELECT') {
            // $data = $statement->fetchAll();
            $data = $statement->fetchAll(PDO::FETCH_ASSOC);
            return $data;
        }
    }


}