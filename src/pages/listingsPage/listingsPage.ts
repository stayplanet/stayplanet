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
      });

      console.log(this.bookings);
    });
  }

  goToInvoice(booking){
    this.navCtrl.push(InvoicePage, {'user': this.user, 'booking': booking});
  }

  goHome(){
    this.navCtrl.popToRoot();
  }

}
