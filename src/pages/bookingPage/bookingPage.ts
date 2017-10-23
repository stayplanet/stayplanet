import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'bookingPage',
  templateUrl: 'bookingPage.html',
})
export class BookingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingPage');
  }

  goHome(){
    this.navCtrl.popToRoot();
  }

}
