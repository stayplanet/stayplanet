<?php
   header('Access-Control-Allow-Origin: *');

   // Define database connection parameters
   $hostName = $localhost;
   $userName = $dbUserName;
   $password = $dbPassword;
   $database = $databaseName;
   $charset = 'utf8';

   // Set up the PDO parameters
   $dsn  = "mysql:host=" . $hostName . ";port=3306;dbname=" . $database . ";charset=" . $charset;
   $opt  = array(
                        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
                        PDO::ATTR_EMULATE_PREPARES   => false,
                );
   // Create a PDO instance (connect to the database)
   $pdo  = new PDO($dsn, $userName, $password, $opt);
   $data = array();

   // Attempt to query database table and retrieve data
   try{
      $stmt = $pdo->query('SELECT * FROM fc_city');
      while($row  = $stmt->fetch(PDO::FETCH_OBJ)){
         // Assign each row of data to associative array
         $data[] = $row;
      }
      print_r($data);
      echo json_encode($data);
   }catch(PDOException $e){
      echo $e->getMessage();
   }

?>