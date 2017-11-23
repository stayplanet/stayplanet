import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { InvoicePage } from '../pages';

import { DatabaseService } from '../../services/databaseService';

import * as _ from 'lodash';

@Component({
  selector: 'listingsPage',
  templateUrl: 'listingsPage.html',
})
export class ListingsPage {

  user: any;
  bookings: any[];
  booking_expiry: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private databaseService: DatabaseService
  ) {
  }

  ionViewDidLoad() {
    this.user = this.navParams.data;
    this.databaseService.getUserBookings(this.user.accounts_id).subscribe(bookings => {
      this.bookings = bookings;
      _.forEach(this.bookings, booking => {
        booking.booking_subitem = JSON.parse(booking.booking_subitem);
        if (!booking.hotel_stars) {
          booking.hotel_stars = 0;
        } else {
          booking.hotel_stars = parseInt(booking.hotel_stars);
        }
        booking['stars'] = Array(booking.hotel_stars);
        booking['noStars'] = Array(5 - booking.hotel_stars);

        let booking_date = new Date(parseInt(booking.booking_date) * 1000);
        booking['booking_date_date'] = booking_date.getDate() + "/" + (booking_date.getMonth() + 1) + "/" + booking_date.getFullYear() + " "
        + this.getTime(booking_date.getHours()) + ":" + this.getTime(booking_date.getMinutes());

        let booking_expiry = new Date(parseInt(booking.booking_expiry) * 1000);
        booking['booking_expiry_date'] = booking_expiry.getDate() + "/" + (booking_expiry.getMonth() + 1) + "/" + booking_expiry.getFullYear() + " "
          + this.getTime(booking_expiry.getHours()) + ":" + this.getTime(booking_expiry.getMinutes());

      });
    });
  }

  getTime(number) {
    let result: string;
    number < 10 ? result = "0" + number : result = number;
    return result;
  }

  goToInvoice(booking) {
    this.navCtrl.push(InvoicePage, { 'user': this.user, 'booking': booking });
  }

  goHome() {
    this.navCtrl.popToRoot();
  }

}
