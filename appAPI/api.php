<?php
header('Access-Control-Allow-Origin: *');
// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH . 'modules/Api/libraries/REST_Controller.php';

class APP extends REST_Controller {
	private $settings;
	function __construct() {
		// Construct our parent class
		parent :: __construct();
        
                if(!$this->isValidApiKey){
                    $this->response($this->invalidResponse, 400);
                }
                // Configure limits on our controller methods. Ensure
                // you have created the 'limits' table and enabled 'limits'
                // within application/config/rest.php
                $this->methods['list_get']['limit'] = 500; //500 requests per hour per user/key
                $this->methods['user_post']['limit'] = 100; //100 requests per hour per user/key
                $this->methods['user_delete']['limit'] = 50; //50 requests per hour per user/key
                $this->load->library('Hotels/Hotels_lib');
                $this->load->model('Api/Apihotels_model');
                $this->settings = $this->Settings_model->get_settings_data();
                $lang = $this->get('lang');
                $this->Hotels_lib->set_lang($lang);
	}

    private function getCities(){
        try{
            $query = mysql_query("SELECT * FROM pt_locations");
            if($query){
                $locations = array();
                while($result = mysql_fetch_assoc($query)){
                    array_push($locations, $result);
                }
                print_r(json_encode($locations));
            }
        }catch(PDOException $e){
            echo $e->getMessage();
        }
    }


}