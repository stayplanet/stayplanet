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
		print_r("SELECT * FROM pt_rooms WHERE room_hotel  = " .$room_hotel. "and room_min_stay = " .$room_min_stay);
		try{
		    $result = $this->db->query("SELECT * FROM pt_rooms WHERE room_hotel  = " .$room_hotel. "and room_min_stay <=" .$room_min_stay)->result();
		    if($result){
		        print_r(json_encode($result));
		    }
		}catch(PDOException $e){
		    echo $e->getMessage();
		}
    }

}