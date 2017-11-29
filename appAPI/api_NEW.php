<?php
header('Access-Control-Allow-Origin: *');
// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH . 'modules/Api/libraries/REST_Controller.php';
include("./application/modules/Creditcard/controllers/Creditcard.php");

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
	
	function getAccommodation_get(){
		$hotel_id = filter_var($_REQUEST['hotel_id'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		try{
		    $result = $this->db->query("SELECT * FROM pt_hotels WHERE hotel_id = " .$hotel_id)->result();
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
		$room_id =  filter_var($_REQUEST['room_id'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
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
			$days[$y][$m][$d] = $this->db->query("SELECT d" .$d. " as day FROM pt_rooms_availabilities WHERE room_id = ".$room_id." AND y = " .$y. " AND m = " .$m. " ")->result()[0]->day;
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
		$days[$y][$m][$d] = $this->db->query("SELECT d" .$d. " as day FROM pt_rooms_availabilities WHERE room_id = ".$room_id." AND y = " .$y. " AND m = " .$m. " ")->result()[0]->day;
		print_r(json_encode($days));
	}

	function updateRoomAvailability_get(){
		$room_id =  filter_var($_REQUEST['room_id'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$day1 =  filter_var($_REQUEST['day1'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$month1 = filter_var($_REQUEST['month1'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW) + 1;
		$year1 = filter_var($_REQUEST['year1'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW) - 2017;
		$day2 = filter_var($_REQUEST['day2'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$month2 = filter_var($_REQUEST['month2'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW) + 1;
		$year2 = filter_var($_REQUEST['year2'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW) - 2017;
		$quantity = filter_var($_REQUEST['quantity'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
	
		$d = $day1;
		$m = $month1;
		$y = $year1;
		while(true){
			$this->db->query("UPDATE pt_rooms_availabilities SET d".$d. " = cast(d".$d." as SIGNED) - ".$quantity." WHERE room_id = ".$room_id." AND y = " .$y. " AND m = " .$m. ";");
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
		$this->db->query("UPDATE pt_rooms_availabilities SET d".$d. " = d".$d. " - ".$quantity." WHERE room_id = ".$room_id." AND y = " .$y. " AND m = " .$m. ";");
	}

	function compareEmail_get(){
		$email = filter_var($_REQUEST['email'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        try{
			$result = $this->db->query("SELECT accounts_id, accounts_email, ai_first_name FROM pt_accounts WHERE accounts_email = '" .$email. "'")->result();
            if(json_encode($result)){
                print_r(json_encode($result));
			}else{
				echo "Something went wrong";
			}
        }catch(PDOException $e){
            echo $e->getMessage();
        }
	}

	function appLogin_post(){
		$data = file_get_contents("php://input");
        $email = filter_var($_REQUEST['email'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $password = filter_var($_REQUEST['password'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		try{
		    $user = $this->db->query("SELECT * FROM pt_accounts WHERE accounts_email = '" .$email. "' AND accounts_password ='" .$password. "'")->result();
		    if($user){
		        print_r(json_encode($user[0]));
		    }
		}catch(PDOException $e){
		    echo $e->getMessage();
		}
	}
	
	function appSignUp_post(){
		$data = file_get_contents("php://input");
        $name = filter_var($_REQUEST['name'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $surname = filter_var($_REQUEST['surname'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		//$gender = filter_var($_REQUEST['gender'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
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
			$result = $this->db->query("INSERT INTO pt_accounts (ai_first_name, ai_last_name, accounts_email, accounts_password, ai_country, ai_address_1, ai_mobile, ai_postal_code, accounts_type, is_stayplanet)
			VALUES ('$name', '$surname', '$email', '$password', '$country', '$address', '$phoneNumber', '$postCode', '$membershipType', '1')");
		    if($result){
                echo "Ok";
            }else{
                echo "Something went wrong";
            }
        }catch(PDOException $e){
           echo $e->getMessage();
        }
	}

	function uploadUserInfo_get(){
		//$id = filter_var($_REQUEST['id'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$name = filter_var($_REQUEST['name'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$surname = filter_var($_REQUEST['surname'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$email = filter_var($_REQUEST['email'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$country = filter_var($_REQUEST['country'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$city = filter_var($_REQUEST['city'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$mobilePhone = filter_var($_REQUEST['mobilePhone'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		try{
			$result = $this->db->query("UPDATE pt_accounts SET ai_first_name = '" .$name. "', ai_last_name = '" .$surname. "', accounts_email = '" .$email. "', ai_country = '" .$country. "', ai_city = '" .$city. "', ai_mobile = '" .$mobilePhone. "' WHERE accounts_email = '" .$email. "'");
            if($result){
                echo 'true';
			}else{
				echo 'Something went wrong';
			}
        }catch(PDOException $e){
            echo $e->getMessage();
        }

	}
	
	function uploadImage_post(){
		$path = "./uploads/images/users/";
        $target_path = $path . basename( $_FILES['file']['name']);
		$oldTargetPath =  $path . filter_var($_REQUEST['email'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        foreach (glob($oldTargetPath . '.*') as $filename) {
            print_r('$filename: ' .$filename);
            unlink($filename);
        }
        if (move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
            echo "Upload and move success";
        } else {
            echo "There was an error uploading the file, please try again!";
		}
    }

    function updateUserImage_get(){
        $imageName = filter_var($_REQUEST['imageName'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $userEmail = filter_var($_REQUEST['userEmail'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        try {
			$result = $this->db->query("UPDATE pt_accounts set ai_image = '" .$imageName. "' WHERE accounts_email = '" .$userEmail. "'");
            if($result){
                print_r("UPDATE pt_accounts set ai_image = '" .$imageName. "' WHERE accounts_email = '" .$userEmail. "'");
            }else{
                echo "Something went wrong";
            }
        }catch(PDOException $e){
           echo $e->getMessage();
        }
	}
	
	function getNewsLetter_get(){
		$email = filter_var($_REQUEST['email'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		try{
		    $result = $this->db->query("SELECT * FROM pt_newsletter WHERE newsletter_subscribers = '" .$email. "'")->result();
		    if($result){
		        print_r(json_encode($result));
		    }
		}catch(PDOException $e){
		    echo $e->getMessage();
		}
	}

	function setNewsLetter_get(){
		$email = filter_var($_REQUEST['email'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$value = filter_var($_REQUEST['value'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		try{
			if($value == 'true'){
				$result = $this->db->query("INSERT INTO pt_newsletter(newsletter_subscribers, newsletter_type, newsletter_status) VALUES ('" .$email. "', 'subscribers', 'Yes');");
				if($result){
					print_r(json_encode($result));
				}
			}else if($value == 'false'){
				$result = $this->db->query("DELETE FROM pt_newsletter WHERE newsletter_subscribers = '" .$email. "';");
				if($result){
					print_r(json_encode($result));
				}
			}

		}catch(PDOException $e){
		    echo $e->getMessage();
		}
	}

	function registerBooking_get(){
		$booking_ref_no = date_timestamp_get(date_create());
		$booking_type = filter_var($_REQUEST['booking_type'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$booking_item = filter_var($_REQUEST['booking_item'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$booking_subitem = filter_var($_REQUEST['booking_subitem'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$booking_subitem = explode(" ", $booking_subitem);
		$booking_subitemString = '{"id":' .$booking_subitem[0]. ', "price":' .$booking_subitem[1]. ', "count":' .$booking_subitem[2]. '}';
		date_default_timezone_set('UTC');
		$booking_date = date_timestamp_get(date_create('now'));
		$booking_expiry = date_create('now');
		$booking_expiry = date_timestamp_get(date_add($booking_expiry, date_interval_create_from_date_string('1 days')));
		$booking_user = filter_var($_REQUEST['booking_user'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$booking_total = filter_var($_REQUEST['booking_total'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$booking_amount_paid = filter_var($_REQUEST['booking_amount_paid'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$booking_remaining = $booking_total;
		$booking_checkin = filter_var($_REQUEST['booking_checkin'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$booking_checkout = filter_var($_REQUEST['booking_checkout'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$booking_nights = filter_var($_REQUEST['booking_nights'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$booking_adults = filter_var($_REQUEST['booking_adults'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$booking_deposit = $booking_total;
		$booking_tax = '0';
		$booking_paymethod_tax = '0';
		$booking_extra_beds = filter_var($_REQUEST['booking_extra_beds'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$booking_extra_beds_charges = filter_var($_REQUEST['booking_extra_beds_charges'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$booking_curr_code = filter_var($_REQUEST['booking_curr_code'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$booking_curr_symbol = filter_var($_REQUEST['booking_curr_symbol'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		try{
			$this->db->query("INSERT INTO pt_bookings(booking_ref_no, booking_type, booking_item, booking_subitem, booking_date, booking_expiry, booking_user, booking_status, booking_total,
			booking_amount_paid, booking_remaining, booking_checkin, booking_checkout, booking_nights, booking_adults, booking_deposit, booking_tax, booking_paymethod_tax,
			booking_extra_beds, booking_extra_beds_charges, booking_curr_code, booking_curr_symbol)
			VALUES ('" .$booking_ref_no. "', '" .$booking_type. "', '" .$booking_item. "', '" .$booking_subitemString. "', '" .$booking_date. "', '" .$booking_expiry. "', '" .$booking_user. "', 'unpaid', '" .$booking_total. "',
			'" .$booking_amount_paid. "', '" .$booking_remaining. "', '" .$booking_checkin. "', '" .$booking_checkout. "', '" .$booking_nights. "', '" .$booking_adults. "', '" .$booking_deposit. "',
			'" .$booking_tax. "', '" .$booking_paymethod_tax. "', '" .$booking_extra_beds. "', '" .$booking_extra_beds_charges. "', '" .$booking_curr_code. "', '" .$booking_curr_symbol. "');");
			$inserted_id = $this->db->conn_id->insert_id;
			$result = $this->db->query("SELECT * FROM pt_bookings WHERE booking_id = " .$inserted_id)->result();
			if($result){
				print_r(json_encode($result));
			}
		}catch(PDOException $e){
		    echo $e->getMessage();
		}
	}

	function getUserBookings_get(){
		$accounts_id = filter_var($_REQUEST['accounts_id'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		try{
		    $result = $this->db->query(
				"SELECT bookings.*, hotels.hotel_title, hotels.hotel_map_city, hotels.hotel_stars
				FROM pt_bookings as bookings INNER JOIN pt_hotels as hotels ON bookings.booking_item = hotels.hotel_id
				WHERE bookings.booking_user = " .$accounts_id)->result();
		    if($result){
		        print_r(json_encode($result));
		    }
		}catch(PDOException $e){
		    echo $e->getMessage();
		}
	}

	function payInvoice_post(){
		$data = file_get_contents("php://input");
		$stripeToken = json_decode($_REQUEST['stripeToken']);
		$paymethod = 'stripe';
		$bookingid = $_REQUEST['booking_id'];
		$refno = $_REQUEST['bookinf_ref_no'];
		$firstname = $_REQUEST['firstname'];
		$lastname = $_REQUEST['lastname'];
		$cardnum = $stripeToken->card->number;
		$expMonth = $stripeToken->card->exp_month;
		$expYear = $stripeToken->card->exp_year;
		$cvv = $stripeToken->card->cvv;
		$price = $_REQUEST['price'];
		
		$creditCard = new Creditcard();
		$result = $creditCard->index_API($paymethod, $bookingid, $refno, $firstname, $lastname, $cvv, $expMonth, $expYear, $cardnum);
		print_r($result);
	}

	function getWishlist_get(){
		$wish_user = filter_var($_REQUEST['wish_user'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$wish_itemid = filter_var($_REQUEST['wish_itemid'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		try{
			$result = $this->db->query("SELECT wish_id FROM pt_wishlist WHERE wish_user = ".$wish_user." AND wish_itemid = ".$wish_itemid.";")->result();
		    if($result){
		        print_r(json_encode($result));
			}
		}catch(PDOException $e){
		    echo $e->getMessage();
		}
	}

	function addToWhishlist_get(){
		$wish_user = filter_var($_REQUEST['wish_user'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$wish_itemid = filter_var($_REQUEST['wish_itemid'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$wish_module = filter_var($_REQUEST['wish_module'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		try{
			$result = $this->db->query("INSERT INTO pt_wishlist(wish_user, wish_itemid, wish_module) VALUES ('".$wish_user."', '".$wish_itemid."', '".$wish_module."');");
		    if($this->db->conn_id->affected_rows == 1){
		        print_r(json_encode($result));
			}
		}catch(PDOException $e){
		    echo $e->getMessage();
		}
	}

	function removeFromWhishlist_get(){
		$wish_user = filter_var($_REQUEST['wish_user'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		$wish_itemid = filter_var($_REQUEST['wish_itemid'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		try{
			$result = $this->db->query("DELETE FROM pt_wishlist WHERE wish_user = ".$wish_user." AND wish_itemid = ".$wish_itemid.";");
		    if($this->db->conn_id->affected_rows == 1){
		        print_r(json_encode($result));
			}
		}catch(PDOException $e){
		    echo $e->getMessage();
		}
	}

	function getUserWishlist_get(){
		$wish_user = filter_var($_REQUEST['wish_user'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
		try{
			$result = $this->db->query("SELECT * FROM pt_wishlist WHERE wish_user = ".$wish_user.";")->result();
			if($result){
				print_r(json_encode($result));
			}
		}catch(PDOException $e){
		    echo $e->getMessage();
		}
	}

}