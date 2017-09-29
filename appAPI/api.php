<?php

require_once("db.php");
    
class API extends Database {

    function __construct(){
        header('Access-Control-Allow-Origin: *');
        ob_Start();
        
        $hostname = "localhost";
        $username = "stay_francisco";
        $password = "@20Francisco17";
        $db_name = "stay_francisco";	
        $connect = mysql_connect($hostname, $username, $password);
        mysql_select_db($db_name, $connect);
    }
    
    public $data = "";

    /*Public method for access api. * This method dynmically call the method based on the query string*/
    public function processApi(){
        $func = strtolower(trim(str_replace("/", "", $_REQUEST['rquest'])));
        if(method_exists($this, $func)){
            $this->$func();
        }else{
            echo "me echa";
            $this->response('', 404); // If the method not exist with in this class, response would be "Page not found".
        }
    }
        
    /* register API Login must be POST method email : <USER EMAIL> pwd : <USER PASSWORD> */
    private function login(){  
        
        if($_REQUEST['email'] == "" ){
            $responseJSON = array("Status" => "false","Message" => "Please enter valid email");
            $response = json_encode($responseJSON);
            echo $response;	
        }elseif($_REQUEST['password'] == "" ){
            $responseJSON = array("Status" => "false","Message" => "Please enter your password");
            $response = json_encode($responseJSON);
            echo $response;	
        }else{
            $email = $_REQUEST['email'];
        }
    
        $password = $_REQUEST['password'];
        $md5Password = md5($password);
        $query = mysql_query("SELECT * FROM fc_users where email='$email' AND password='$md5Password' ");
        $total = mysql_num_rows($query);
        while($result = mysql_fetch_array($query)){
            $key = $result['api_key'];
            $token_key = $result['token_id'];	
        }

        if($total>0){
            $responseJSON = array("Status" => "true","Message" => "you are now login","Api_key"=>$key,"Token_key"=>$token_key);
            $response = json_encode($responseJSON);
            echo $response;	
        }else{
            $responseJSON = array("Status" => "false","Message" => "Wrong username and password");
            //header("content-type:application/json");
            $response = json_encode($responseJSON);
            echo $response;	
        }
    }
    
    private function find_property(){  
        
        ob_Start();
        
        $hostname="localhost";	
        $username="stay_spdb";
        $password="538mhs8MNT930mG";
        $db_name="stay_spdb";	
        $connect=mysql_connect($hostname,$username,$password);
        mysql_select_db($db_name,$connect);
        $email=$_REQUEST['email'];
        $api_key=$_REQUEST['api_key'];
        $token_id=$_REQUEST['token_id'];
        $location=$_REQUEST['location'];
        
        if($_REQUEST['email']=="" ){
            echo "Please enter valid email";    
        }elseif($_REQUEST['api_key']=="" ){
            echo "Please enter valid Api key";
        }elseif($_REQUEST['token_id']=="" ){
            echo "Please enter valid Token id";
        }elseif($_REQUEST['location']=="" ){
            echo "Please enter valid Location";
        }else{   
            $query=mysql_query("SELECT * FROM fc_users where email='$email'");
            $total=mysql_num_rows($query);

            if($total>0){
                $query1=mysql_query("SELECT api_key FROM fc_users where email='$email' AND api_key='$api_key'");
                $total1=mysql_num_rows($query1);

                if($total1 >0){
                    $query3=mysql_query("SELECT api_key FROM fc_users where email='$email' AND token_id='$token_id'");
                    $totalss=mysql_num_rows($query3);

                    if($totalss>0){
                        $query33=mysql_query("SELECT fc_product_address_new.address,fc_product_address_new.city,fc_product_address_new.state,fc_product_address_new.country,fc_product.product_title,fc_product.price
                                            FROM fc_product_address_new 
                                            INNER JOIN fc_product
                                            ON fc_product_address_new.productId=fc_product.id
                                            WHERE fc_product_address_new.state='$location'");
                        $counts=mysql_num_rows($query33);

                        if($counts=="0"){
                            $responseJSON = array("Status" => "false","Message" => "Result not found");
                            $response = json_encode($responseJSON);
                            echo $response;	
                        }
                        
                        while($result1=mysql_fetch_array($query33)){
                            $response["response"][] = $result1;
                            $arr =
                                array(
                                    array(
                                        "address" => $result1['address'],	
                                        "city" => $result1['city'],
                                        "state" => $result1['state'],
                                        "country" => $result1['country'],
                                        "product_title" => $result1['product_title'],
                                        "price" => $result1['price']
                                    )
                                );
                                echo json_encode($response);
                        }

                        $responseJSON = array("Status" => "True","Message" => "result","result"=>$arr);
                    }else{
                        $responseJSON = array("Status" => "false","Message" => "Wrong token id");
                        $response = json_encode($responseJSON);
                        echo $response;	
                    }
                }else{
                    $responseJSON = array("Status" => "false","Message" => "Wrong api key");
                    $response = json_encode($responseJSON);
                    echo $response;	
                }
            }else{
                $responseJSON = array("Status" => "false","Message" => "Your email and password wrong");
                $response = json_encode($responseJSON);
                echo $response;	
            }
                $total;
        }
        
    }

    //valid user
    private function is_valid_user($email,$api_key,$token_id){
        ob_Start();
        $hostname="localhost";	
        $username="stay_spdb";
        $password="538mhs8MNT930mG";
        $db_name="stay_spdb";	
        $connect=mysql_connect($hostname,$username,$password);
        mysql_select_db($db_name,$connect);
        $email=$email;
        $api_key=$api_key;
        $token_id=$token_id;
        if($_REQUEST['email']=="" ){
                    echo "Please enter valid email";
        }elseif($_REQUEST['api_key']=="" ){
                echo "Please enter valid Api key";
        }elseif($_REQUEST['token_id']=="" ){
                echo "Please enter valid Token id";
        }else{
            $query=mysql_query("SELECT api_key FROM fc_users where email='$email' AND token_id='$token_id' AND api_key='$api_key'");
            $total=mysql_num_rows($query);
            if($total>0){
                return true;
            }else{
                $responseJSON = array("Status" => "false","Message" => "Invalid credentials");
                $response = json_encode($responseJSON);
                echo $response;	
            }		
        }	
                
        
    }	
    
    //Inventory	update
    private function check_availability(){  
        if($this->is_valid_user($_REQUEST['email'],$_REQUEST['api_key'],$_REQUEST['token_id'])){
            $responseJSON = array("Status" => "true","Message" => "Valid");
            $response = json_encode($responseJSON);
            echo $response;	
        }
    }	

    private function propertyDetails(){
        if($this->is_valid_user($_REQUEST['email'],$_REQUEST['api_key'],$_REQUEST['token_id'])){
            //die('test');
            $query="SELECT fc_booking.id as booking_id,fc_booking.owner_id,fc_booking.property_id,fc_booking.booking_date,fc_booking.booking_userid,fc_booking.check_in,fc_booking.adults as Guests,fc_booking.check_out,fc_booking.nights,fc_booking.currency_code,fc_booking.booking_status,fc_booking.total,fc_booking.guest_name,fc_booking.address,fc_booking.email,fc_booking.phone,
            fc_product.product_title,fc_product.home_type as property_type,fc_product.room_type,fc_product.accommodates,fc_product.bedrooms,fc_product.price AS rate,fc_product.beds,fc_product.noofbathrooms,fc_product.city as property_city,fc_product.bed_type,fc_product.minimum_stay,fc_product.security_deposit,fc_product.instantbook,
            fc_users.user_name,fc_users.email as host_email,fc_users.phone_no as host_phone,fc_users.s_address,fc_users.s_city,fc_users.s_district,fc_users.s_state,fc_users.s_country,fc_users.s_postal_code,fc_users.firstname,fc_users.lastname 
            FROM fc_product
            Left JOIN fc_booking ON fc_booking.property_id=fc_product.id
            INNER JOIN fc_users ON fc_product.user_id=fc_users.id
            WHERE fc_product.id='{$_REQUEST['property_id']}'";
            $qry=mysql_query($query);
            $counts=mysql_num_rows($qry);
            $result=mysql_fetch_array($qry);
            if($counts=="0"){
                $responseJSON = array("Status" => "false","Message" => "Result not found");
                $response = json_encode($responseJSON);
                echo $response;	
            }else{
                $responseJSON = array("Status" => "True","Message" => "result","result"=>$result);
                $response = json_encode($responseJSON);
                echo '<pre>'.$response;	
            }
        }
    }
        
    private function savePropertyStatus(){
        //channel manaer api validation
        $today=date('Y-m-d');
        $query="INSERT INTO fc_booking_status SET property_id='{$_REQUEST['property_id']}',month='{$_REQUEST['month']}',year='{$_REQUEST['year']}',data='{$_REQUEST['data']}',date_added='{$today}'";
        $qry=mysql_query($query);
        if($qry){
            $responseJSON = array("Status" => "true","Message" => "Record added successfully");
            $response = json_encode($responseJSON);
            echo '<pre>'.$response;	
        }else{
            $responseJSON = array("Status" => "false","Message" => "Error occurred while adding data");
            $response = json_encode($responseJSON);
            echo '<pre>'.$response;	
        }
    }

    /********************** APP API **********************/
    
    private function getCities(){
        try{
            $query = mysql_query("SELECT id, name, top_destination, country_name, citythumb FROM fc_city");
            if($query){
                $cities = array();
                while($result = mysql_fetch_assoc($query)){
                    array_push($cities, $result);
                }
                print_r(json_encode($cities));
            }
        }catch(PDOException $e){
            echo $e->getMessage();
        }
    }

    private function getCity(){
        $id = filter_var($_REQUEST['id'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        try {
            $query = mysql_query("SELECT * FROM fc_city WHERE id = " .$id);
            if($query){
                $city = array();
                while($result = mysql_fetch_assoc($query)){
                    array_push($city, $result);
                }
                print_r(json_encode($city));
            }else{
                echo "Something went wrong";
            }
        }catch(PDOException $e){
           echo $e->getMessage();
        }
    }

    private function searchCityProperties(){
        $city = filter_var($_REQUEST['city'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        try {
            $query = mysql_query(
                "SELECT p.id, p.seller_product_id, p.created, p.product_name, p.product_title, p.price,
                        p.price_range, p.price_perweek, p.price_permonth, p.image, p.home_type, p.room_type,
                        p.accommodates, p.bedrooms,p.beds, p.bed_type, p.bathrooms, p.listings, p.datefrom, p.dateto, p.minimum_stay
                FROM fc_product as p INNER JOIN fc_product_address_new ON p.id = fc_product_address_new.productId
                WHERE fc_product_address_new.city = '" .$city. "';");
            if($query){
                $properties = array();
                while($result = mysql_fetch_assoc($query)){
                    array_push($properties, $result);
                }
                print_r(json_encode($properties));
            }else{
                echo "Something went wrong";
            }
        }catch(PDOException $e){
            echo $e->getMessage();
        }
    }

    private function getMinMaxPrice(){
        $city = filter_var($_REQUEST['city'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        try {
            $query = mysql_query(
                "SELECT MIN(nueva.price) as minPrice, MAX(nueva.price) as maxPrice
                FROM 
                    (SELECT p.price
                    FROM fc_product as p INNER JOIN fc_product_address_new ON p.id = fc_product_address_new.productId
                    WHERE fc_product_address_new.city = '" .$city. "')
                as nueva");

            if($query){
                $properties = array();
                while($result = mysql_fetch_assoc($query)){
                    array_push($properties, $result);
                }
                print_r(json_encode($properties));
            }else{
                echo "Something went wrong";
            }
        }catch(PDOException $e){
            echo $e->getMessage();
        }
    }

    private function appLogin(){
        $email = filter_var($_REQUEST['email'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $password = filter_var($_REQUEST['password'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $password = md5($password);
        try {
            $query = mysql_query("SELECT * FROM fc_users WHERE email = '" .$email. "' AND password = '" .$password. "'");
            if($query){
                $user = array();
                while($result = mysql_fetch_assoc($query)){
                    array_push($user, $result);
                }
                print_r(json_encode($user[0]));
            }else{
                echo "Something went wrong";
            }
        }catch(PDOException $e){
            echo $e->getMessage();
         }
    }

/*
    private function createCity(){
        $name = filter_var($_REQUEST['name'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $country_name = filter_var($_REQUEST['country_name'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);

        try {
            $query = "INSERT INTO fc_city (name, country_name) VALUES ('" .$name. "', '" .$country_name. "');";
            echo $query;
            $qry = mysql_query($query);
            echo $qry;
            if($qry){
                $responseJSON = array("Status" => "true","Message" => "Record added successfully");
                $response = json_encode($responseJSON);
                echo $response;	
            }else{
                $responseJSON = array("Status" => "false","Message" => "Error occurred while adding data");
                $response = json_encode($responseJSON);
                echo $response;	
            }

        }catch(PDOException $e){
           echo $e->getMessage();
        }
    }
*/
    /********************** APP API **********************/
}
    // Initiiate Library
    $api = new API;
    $api->processApi();

?>