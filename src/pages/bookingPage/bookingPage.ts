import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { InvoicePage } from '../pages';

import { DatabaseService } from '../../services/databaseService';

@Component({
  selector: 'bookingPage',
  templateUrl: 'bookingPage.html',
})
export class BookingPage {

  accommodation: any;
  totalAmount: number;
  user: any;
  notes_addRequest: string = '';
  couponCode: string = '';
  room: any;
  guests: number;
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
    this.user = this.navParams.data.user;
    this.room = this.navParams.data.room;
    this.guests = this.navParams.data.guests;
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
      this.totalAmount = this.room.room_basic_price * this.nights + parseInt(this.accommodation.booking_fee);
    });
  }
  
  applyCoupon() {
    console.log(this.couponCode);
  }

  confirmBooking() {
    let booking_subitem_object = { id: this.room.room_id, price: this.accommodation.hotel_basic_price * this.roomsQuantity, count: this.roomsQuantity };
    let checkInDate = this.checkInDate.year + '/' + this.checkInDate.month + '/' + this.checkInDate.day;
    let checkOutDate = this.checkOutDate.year + '/' + this.checkOutDate.month + '/' + this.checkOutDate.day;
    this.databaseService.registerBooking(this.accommodation.module, this.accommodation.hotel_id, booking_subitem_object, this.user.accounts_id, this.totalAmount, 0,
      checkInDate, checkOutDate, this.nights, this.guests, this.extraBeds, this.room.extra_bed_charges, 'EUR', '€').subscribe(res => {
        if (res.length > 0) {
          this.navCtrl.push(InvoicePage, { 'user': this.user, 'booking': res[0] });
          this.databaseService.updateRoomAvailability(this.room.room_id, this.checkInDate, this.checkOutDate, this.roomsQuantity).subscribe(res => {
          });
        }

      });
  }

  goHome() {
    this.navCtrl.popToRoot();
  }

}
