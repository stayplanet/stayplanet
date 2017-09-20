import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SignupPage } from '../pages';

@Component({
  selector: 'loginPage',
  templateUrl: 'loginPage.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  goToSignup(){
    this.navCtrl.push(SignupPage);
  }

	goHome() {
		this.navCtrl.popToRoot();
	}

}
