import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'trustAndVerificationPage',
  templateUrl: 'trustAndVerificationPage.html',
})
export class TrustAndVerificationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrustAndVerificationPage');
  }

}
