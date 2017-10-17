import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'profilePhotoPage',
  templateUrl: 'profilePhotoPage.html',
})
export class ProfilePhotoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePhotoPage');
  }

}
