import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'bookingPage',
  templateUrl: 'bookingPage.html',
})
export class BookingPage {

  user: any = {};
  room: any = {};
  checkInDate: any = {};
  checkOutDate: any = {};
  nights: number;
  roomsQuantity: number;
  extraBeds: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingPage');
    this.user = this.navParams.data.user;
    this.room = this.navParams.data.room;
    this.checkInDate = this.navParams.data.checkInDate;
    this.checkOutDate = this.navParams.data.checkOutDate;
    this.nights = this.navParams.data.nights;
    this.roomsQuantity = this.navParams.data.roomsQuantity;
    this.extraBeds = this.navParams.data.extraBeds;
    console.log(this.navParams.data);
    console.log(this.user);
    console.log(this.room);
    console.log(this.checkInDate);
    console.log(this.checkOutDate);
    console.log(this.nights);
    console.log(this.roomsQuantity);
    console.log(this.extraBeds);
  }

  goHome(){
    this.navCtrl.popToRoot();
  }

}
