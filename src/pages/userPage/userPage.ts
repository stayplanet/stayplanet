import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';

import { DatabaseService } from '../../services/databaseService';

@Component({
  selector: 'userPage',
  templateUrl: 'userPage.html',
})
export class UserPage {

  user: any;
  userGender: string;
  userCountry: string;
  userPhoneNumberCode: string;
  userBirthday: string;
  countries: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private databaseService: DatabaseService
  ) {
  }

  ionViewDidLoad() {
    this.user = this.navParams.data;
    console.log("user in user: ", this.user);
    this.userGender = this.user.gender;
    this.userCountry = this.user.country;
    this.userBirthday = this.user.birthday;
    this.databaseService.getCountries().subscribe(countries => {
      this.countries = countries;
      this.selectPhoneNumberCode();
    });
  }
  selectPhoneNumberCode() {
    //this.userPhoneNumberCode = _.find(this.countries, ['name', this.userCountry]).country_mobile_code;
  }

}
