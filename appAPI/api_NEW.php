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

	function test_get(){ 
		$result = $this->db->query('SELECT * FROM pt_locations;')->result();
		print_r($result);
	}
	
	function getCities_get(){
		try{
		    $result = $this->db->query("SELECT * FROM pt_locations")->result();
		    if($result){
		        print_r(json_encode($result));
		    }
		}catch(PDOException $e){
		    echo $e->getMessage();
		}
	}
	

}