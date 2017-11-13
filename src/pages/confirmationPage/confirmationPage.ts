import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'confirmationPage',
  templateUrl: 'confirmationPage.html',
})
export class ConfirmationPage {

  accommodation: any;
  room: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    this.room = this.navParams.data.room;

  }

}
