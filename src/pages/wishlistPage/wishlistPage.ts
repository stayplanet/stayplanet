import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';

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
  loadedImages: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingController: LoadingController,
    private events: Events,
    private databaseService: DatabaseService,
    private userService: UserService
  ) {
  }

  ionViewDidLoad() {
    this.user = this.navParams.data;
    let loader = this.loadingController.create({
      content: 'Please wait...',
    });
    loader.present();
    this.userService.getUserWishlist(this.user.accounts_id).subscribe(wishlist => {
      this.wishlist = wishlist;
      _.forEach(this.wishlist, wishlist => {
        this.databaseService.getAccommodation(wishlist.wish_itemid).subscribe(accommodation => {
          accommodation = accommodation[0];
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
    });
    this.events.subscribe('imagesLoaded', () => {
      loader.dismiss();
    });
  }

  imageLoaded(){
    this.loadedImages++;
    if(this.loadedImages >= this.wishlist.length){
      this.events.publish('imagesLoaded');
    }
  }

  accommodationTapped(accommodation){
    //this.navCtrl.push(PropertyPage, { "property": accommodation });
  }

  goHome(){
    this.navCtrl.popToRoot();
  }

}
