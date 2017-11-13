import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ConfirmationPage } from '../pages';

import { DatabaseService } from '../../services/databaseService';

@Component({
  selector: 'bookingPage',
  templateUrl: 'bookingPage.html',
})
export class BookingPage {

  accommodation: any;
  user: any;
  notes_addRequest: string = '';
  couponCode: string = '';
  room: any;
  checkInDate: any;
  checkOutDate: any;
  nights: number;
  roomsQuantity: number;
  extraBeds: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private databaseService: DatabaseService
  ) {
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
    this.databaseService.getAccommodation(this.room.room_hotel).subscribe(accommodation => {
      this.accommodation = accommodation[0];
      if (!this.accommodation.hotel_stars) {
        this.accommodation.hotel_stars = 0;
      } else {
        this.accommodation.hotel_stars = parseInt(this.accommodation.hotel_stars);
      }
      this.accommodation['stars'] = Array(this.accommodation.hotel_stars);
      this.accommodation['noStars'] = Array(5 - this.accommodation.hotel_stars);
    });
    console.log(this.navParams.data);
    console.log(this.user);
    console.log(this.room);
    console.log(this.checkInDate);
    console.log(this.checkOutDate);
    console.log(this.nights);
    console.log(this.roomsQuantity);
    console.log(this.extraBeds);
    console.log(this.accommodation);
  }

  applyCoupon() {
    console.log(this.couponCode);
  }

  confirmBooking() {
    this.navCtrl.push(ConfirmationPage, { 'room': this.room });
  }

  goHome() {
    this.navCtrl.popToRoot();
  }

}
