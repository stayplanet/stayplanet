import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { UserPage, ProfilePhotoPage } from '../pages';

@Component({
  selector: 'settingsPage',
  templateUrl: 'settingsPage.html',
})
export class SettingsPage {

  userPage = UserPage;
  profilePhotoPage = ProfilePhotoPage;
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log(this.user);
  }

  goHome(){
    this.navCtrl.popToRoot();
  }
}
