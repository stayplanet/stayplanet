import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PropertyPage } from '../pages'

import * as _ from 'lodash';
import { DatabaseService } from '../../services/databaseService';
import { UserService } from '../../services/userService';

@Component({
  selector: 'wishlistPage',
  templateUrl: 'wishlistPage.html',
})
export class WishlistPage {

  user: any;
  wishlist: any[];
  accommodations: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private databaseService: DatabaseService,
    private userService: UserService
  ) {
  }

  ionViewDidLoad() {
    this.user = this.navParams.data;
    this.userService.getUserWishlist(this.user.accounts_id).subscribe(wishlist => {
      this.wishlist = wishlist;
      _.forEach(this.wishlist, wishlist => {
        this.databaseService.getAccommodation(wishlist.wish_itemid).subscribe(accommodation => {
          accommodation = accommodation[0];
          console.log(accommodation);
          if (!accommodation.thumbnail_image.includes('http://')) {
            accommodation.thumbnail_image = 'http://www.stayplanet.net/uploads/images/hotels/slider/' + accommodation.thumbnail_image;
          }
    
          if (!accommodation.hotel_stars) {
            accommodation.hotel_stars = 0;
          } else {
            accommodation.hotel_stars = parseInt(accommodation.hotel_stars);
          }
          accommodation['stars'] = Array(accommodation.hotel_stars);
          accommodation['noStars'] = Array(5 - accommodation.hotel_stars);
          this.accommodations.push(accommodation);
        });
      });
      console.log('this.accommodations: ', this.accommodations);
    });
  }

  imageLoaded(){
    console.log("hacer el load de las imagenes");
  }

  accommodationTapped(accommodation){
    this.navCtrl.push(PropertyPage, { "property": accommodation });
  }

  goHome(){
    this.navCtrl.popToRoot();
  }

}
