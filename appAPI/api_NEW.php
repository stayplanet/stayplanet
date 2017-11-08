<?php
header('Access-Control-Allow-Origin: *');
// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH . 'modules/Api/libraries/REST_Controller.php';

class AppAPI extends REST_Controller {

	protected $ci = NULL;
	protected $db;
	public $hotelid;
	public $appSettings;

	function __construct() {
		parent :: __construct();
		if(!$this->isValidApiKey){
			$this->response($this->invalidResponse, 400);
		}

		$this->ci = & get_instance();
		$this->db = $this->ci->db;
		$this->appSettings = $this->ci->Settings_model->get_settings_data();
	}
	
	function getLocations_get(){
		try{
		    $result = $this->db->query("SELECT * FROM pt_locations WHERE id IN (SELECT DISTINCT hotel_city FROM pt_hotels)")->result();
		    if($result){
		        print_r(json_encode($result));
		    }
		}catch(PDOException $e){
		    echo $e->getMessage();
		}
	}

	function getCountries_get(){
        try{
		    $result = $this->db->query("SELECT id, name, country_mobile_code FROM countries")->result();
		    if($result){
		        print_r(json_encode($result));
		    }
		}catch(PDOException $e){
		    echo $e->getMessage();
		}
    }
	
	function getAccommodations_get(){
		try{
		    $result = $this->db->query("SELECT * FROM pt_hotels")->result();
		    if($result){
		        print_r(json_encode($result));
		    }
		}catch(PDOException $e){
		    echo $e->getMessage();
		}
	}

	function getLocationAccommodations_get(){
		$location = filter_var($_REQUEST['location'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$country = filter_var($_REQUEST['country'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		try{
		    $result = $this->db->query("SELECT * FROM pt_hotels WHERE hotel_city = (SELECT id FROM pt_locations WHERE location = '" .$location. "' and country = '" .$country. "')")->result();
		    if($result){
		        print_r(json_encode($result));
		    }
		}catch(PDOException $e){
		    echo $e->getMessage();
		}
	}

	function getPropertyImages_get(){
        $himg_hotel_id = filter_var($_REQUEST['himg_hotel_id'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		try{
		    $result = $this->db->query("SELECT himg_image FROM pt_hotel_images WHERE himg_hotel_id  = " .$himg_hotel_id)->result();
		    if($result){
		        print_r(json_encode($result));
		    }
		}catch(PDOException $e){
		    echo $e->getMessage();
		}
    }

	function getReviews_get(){
        $review_itemid = filter_var($_REQUEST['review_itemid'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		try{
		    $result = $this->db->query("SELECT * FROM pt_reviews WHERE review_itemid  = " .$review_itemid)->result();
		    if($result){
		        print_r(json_encode($result));
		    }
		}catch(PDOException $e){
		    echo $e->getMessage();
		}
	}
	
	function getRooms_get(){
		$room_hotel = filter_var($_REQUEST['room_hotel'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$room_min_stay = filter_var($_REQUEST['room_min_stay'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		//print_r("SELECT * FROM pt_rooms WHERE room_hotel  = " .$room_hotel. "and room_min_stay = " .$room_min_stay);
		try{
		    $result = $this->db->query("SELECT * FROM pt_rooms WHERE room_hotel = " .$room_hotel. " and room_min_stay <=" .$room_min_stay)->result();
		    if($result){
		        print_r(json_encode($result));
		    }
		}catch(PDOException $e){
		    echo $e->getMessage();
		}
	}

	function getRoomAvailability_get(){
		$day1 =  filter_var($_REQUEST['day1'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$month1 = filter_var($_REQUEST['month1'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW) + 1;
		$year1 = filter_var($_REQUEST['year1'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW) - 2017;
		$day2 = filter_var($_REQUEST['day2'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$month2 = filter_var($_REQUEST['month2'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW) + 1;
		$year2 = filter_var($_REQUEST['year2'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW) - 2017;
		$days = array();

		$d = $day1;
		$m = $month1;
		$y = $year1;
		while(true){
			$days[$y][$m][$d] = $this->db->query("SELECT d" .$d. " as day FROM pt_rooms_availabilities WHERE room_id = 125 AND y = " .$y. " AND m = " .$m. " ")->result()[0]->day;
			$d++;
			if($d > cal_days_in_month(CAL_GREGORIAN, $m, $y+2017)){
				$d = 1;
				$m++;
				if($m > 12){
					$m = 1;
					$y++;
				}
			}
			if($d == $day2 && $m == $month2 && $y == $year2){
				break;
			}
		}
		$days[$y][$m][$d] = $this->db->query("SELECT d" .$d. " as day FROM pt_rooms_availabilities WHERE room_id = 125 AND y = " .$y. " AND m = " .$m. " ")->result()[0]->day;
		print_r(json_encode($days));
	}

	function compareEmail_get(){
		$email = filter_var($_REQUEST['email'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        try{
			$result = $this->db->query("SELECT accounts_id, accounts_email, ai_first_name FROM pt_accounts WHERE accounts_email = '" .$email. "'")->result();
			print_r("SELECT accounts_id, accounts_email, ai_first_name FROM pt_accounts WHERE accounts_email = '" .$email. "'");
            if(json_encode($result)){
                print_r(json_encode($result));
			}else{
				echo "Something went wrong";
			}
        }catch(PDOException $e){
            echo $e->getMessage();
        }
	}

	function appLogin_get(){
        $email = filter_var($_REQUEST['email'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $password = filter_var($_REQUEST['password'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		try{
		    $user = $this->db->query("SELECT * FROM pt_accounts WHERE accounts_email = '" .$email. "' AND accounts_password ='" .$password. "'")->result();
		    if($user){
		        print_r(json_encode($user));
		    }
		}catch(PDOException $e){
		    echo $e->getMessage();
		}
	}
	
	function appSignUp_get(){
        $name = filter_var($_REQUEST['name'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $surname = filter_var($_REQUEST['surname'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$gender = filter_var($_REQUEST['gender'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$phoneNumber = filter_var($_REQUEST['phoneNumber'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $email = filter_var($_REQUEST['email'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $password = filter_var($_REQUEST['password'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$membershipType = filter_var($_REQUEST['membershipType'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        if($membershipType == 'Guest'){
            $membershipType = 'guest';
        }else if($membershipType == 'Host'){
            $membershipType = 'customers';
		}
		$country = filter_var($_REQUEST['country'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        //$region = filter_var($_REQUEST['region'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        //$city = filter_var($_REQUEST['city'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $postCode = filter_var($_REQUEST['postCode'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $address = filter_var($_REQUEST['address'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		//$informAboutLatestNews = filter_var($_REQUEST['informAboutLatestNews'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        try {
			echo "nose1";
			$result = $this->db->query("INSERT INTO pt_accounts (ai_first_name, ai_last_name, accounts_email, accounts_password, ai_country, ai_address_1, ai_mobile, ai_postal_code, accounts_type, is_stayplanet)
			VALUES ('$name', '$surname', '$email', '$password', '$country', '$address', '$phoneNumber', '$postCode', '$membershipType', '1')");
			echo "nose2";
		    if($result){
                echo "Ok";
            }else{
                echo "Something went wrong";
            }
        }catch(PDOException $e){
           echo $e->getMessage();
        }
    }
}