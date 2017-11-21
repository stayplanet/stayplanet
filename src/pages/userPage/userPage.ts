import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import * as _ from 'lodash';

import { DatabaseService } from '../../services/databaseService';
import { UserService } from '../../services/userService';

@Component({
  selector: 'userPage',
  templateUrl: 'userPage.html',
})
export class UserPage {

  user: any;
  //userGender: string;
  userName: string;
  userSurname: string;
  userEmail: string;
  userCountry: string;
  userCity: string;
  userMobilePhone: string;
  //userPhoneNumberCode: string;
  //userBirthday: string;
  countries: any[];


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private databaseService: DatabaseService,
    private userService: UserService
  ) {
  }

  ionViewDidLoad() {
    this.user = this.navParams.data;
    //this.userGender = this.user.gender;
    this.userCountry = this.user.ai_country;
    //this.userBirthday = this.user.birthday;
    this.databaseService.getCountries().subscribe(countries => {
      this.countries = countries;
      //this.selectPhoneNumberCode();
    });
    console.log("user: ", this.user);
  }

  saveInfo(){
    if(this.userName && this.userName != ''){
      this.user.ai_first_name = this.userName;
    }
  
    if(this.userSurname && this.userSurname != ''){
      this.user.ai_last_name = this.userSurname;
    }

    if(this.userEmail && this.userEmail != ''){
      this.user.accounts_email = this.userEmail;
    }
    
    if(this.userCountry && this.userCountry != ''){
      this.user.ai_country = this.userCountry;
    }

    if(this.userCity && this.userCity != ''){
      this.user.ai_city = this.userCity;
    }

    if(this.userMobilePhone && this.userMobilePhone != ''){
      this.user.ai_mobile = this.userMobilePhone;
    }
    console.log(this.user);
    this.userService.uploadUserInfo(this.user.ai_first_name, this.user.ai_last_name, this.user.accounts_email, this.user.ai_country, this.user.ai_city, this.user.ai_mobile).subscribe(result => {
      if(result){
        console.log("todo crema loco");
      }else{
        console.log("pos va a ser que no");
      }
    });
  }

/*
  selectPhoneNumberCode() {
    this.userPhoneNumberCode = _.find(this.countries, ['name', this.userCountry]).country_mobile_code;
  }
*/

}
