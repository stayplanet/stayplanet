import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, NavParams, Slides, ViewController, LoadingController, AlertController, Platform, ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

import { BookingPage, SignupPage, LoginPage } from '../../pages/pages';

import { DatabaseService } from '../../services/databaseService';
import { UserService } from '../../services/userService';

import * as _ from 'lodash';

@Component({
  selector: 'propertyPage',
  templateUrl: 'propertyPage.html',
})
export class PropertyPage {

  user: any;
  showIcons: boolean = false;
  isWishList: boolean;
  property: any = {};
  images: string[] = [];
  filters: any = {};
  guests: number = 1;
  nights: number = 1;
  reviews: any = [];
  seller: any = {};
  rooms: any = [];
  roomsAvailables: any[] = [];
  roomsQuantity: number = 1;
  extraBeds: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private platform: Platform,
    private nativeStorage: NativeStorage,
    private databaseService: DatabaseService,
    private userService: UserService
  ) {
  }

  ionViewDidLoad() {
    let loader = this.loadingController.create({
      content: 'Please wait...',
    });
    loader.present();

    this.property = this.navParams.data.property;
    this.filters = this.navParams.data.filters;
    this.guests = this.navParams.data.guests;

    let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let checkInDate = new Date(this.filters.checkInDate.year, this.filters.checkInDate.month, this.filters.checkInDate.day);
    let checkOutDate = new Date(this.filters.checkOutDate.year, this.filters.checkOutDate.month, this.filters.checkOutDate.day);
    this.nights = Math.round(Math.abs((checkInDate.getTime() - checkOutDate.getTime()) / (oneDay)));

    if (this.platform.is('cordova')) {
      this.nativeStorage.getItem("user").then(user => {
        this.user = user;
        this.userService.getWishlist(this.user.accounts_id, this.property.hotel_id).subscribe(res => {
          this.isWishList = res;
        });
      }).catch(error => {
        if (error.code == 2) { // ITEM NOT FOUND
          this.user = void 0;
        }
      });
    }

    this.databaseService.getPropertyImages(this.property.hotel_id).subscribe(images => {
      images.forEach(image => {
        this.images.push(image.himg_image);
      });
    });

    this.databaseService.getReviews(this.property.hotel_id).subscribe(reviews => {
      this.reviews = reviews;
      this.databaseService.getRooms(this.property.hotel_id, this.nights).subscribe(rooms => {
        this.rooms = rooms;
        _.forEach(this.rooms, room => {
          this.databaseService.getRoomAvailability(room.room_id, this.filters.checkInDate, this.filters.checkOutDate).subscribe(res => {
            let roomNumber = this.roomIsAvailable(res);
            if (roomNumber > 0) {
              if (room.thumbnail_image == 'blank.jpg') {
                room.thumbnail_image = this.property.thumbnail_image;
              } else if (!room.thumbnail_image.includes('http://')) {
                room.thumbnail_image = 'http://www.stayplanet.net/uploads/images/slider/' + room.thumbnail_image;
              }
              room.room_quantity = roomNumber;
              this.roomsAvailables.push(room);
            }
          });
        });
        loader.dismiss();
      });
    });

    setTimeout(() => {
      loader.dismiss();
    }, 7500);
  }

  imageLoaded(){
    this.showIcons = true;
  }

  roomIsAvailable(availability) {
    let roomNumber: number = Number.MAX_SAFE_INTEGER;
    _.forEach(availability, year => {
      _.forEach(year, month => {
        _.forEach(month, day => {
          if (parseInt(day) - this.roomsQuantity < 0) {
            return 0;
          } else if (parseInt(day) < roomNumber) {
            roomNumber = parseInt(day);
          }
        });
      });
    });
    return roomNumber;
  }

  openImagesModal() {
    let imagesModal = this.modalCtrl.create(ImagesModal, { images: this.images });
    imagesModal.present();
  }

  selectNumberOfRooms(room_quantity) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Number of rooms');

    for (let i = 1; i <= room_quantity; i++) {
      if (i == 1) {
        alert.addInput({
          type: 'radio',
          label: '1 room',
          value: i.toString(),
          checked: true
        });
      } else {
        alert.addInput({
          type: 'radio',
          label: i.toString() + ' rooms',
          value: i.toString(),
          checked: false
        });
      }
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.roomsQuantity = Number(data);
      }
    });
    alert.present();
  }

  selectExtraBeds(extra_beds, extra_bed_charges) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Extra beds');

    for (let i = 0; i <= extra_beds; i++) {
      if (i == 0) {
        alert.addInput({
          type: 'radio',
          label: i.toString() + ' beds €' + i * extra_bed_charges,
          value: i.toString(),
          checked: true
        });
      } else if (i == 1) {
        alert.addInput({
          type: 'radio',
          label: '1 bed €' + extra_bed_charges,
          value: i.toString(),
          checked: false
        });
      } else {
        alert.addInput({
          type: 'radio',
          label: i.toString() + ' beds €' + i * extra_bed_charges,
          value: i.toString(),
          checked: false
        });
      }
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.extraBeds = Number(data);
      }
    });
    alert.present();
  }

  book(room) {
    if (this.platform.is('cordova')) {
      this.nativeStorage.getItem("user").then(user => {
        this.navCtrl.push(
          BookingPage,
          {
            "user": user,
            "room": room,
            "guests": this.guests,
            "checkInDate": this.filters.checkInDate,
            "checkOutDate": this.filters.checkOutDate,
            "nights": this.nights,
            "roomsQuantity": this.roomsQuantity,
            "extraBeds": this.extraBeds,
          });
      }).catch(error => {
        if (error.code == 2) { // ITEM NOT FOUND
          let confirm = this.alertCtrl.create({
            title: 'You are not logged in...',
            message: 'If you\'re not logged into the app you can\'t book any property. Go LogIn or SignUp if you don\t have any aacount yet.',
            cssClass: 'custom-alert',
            buttons: [
              {
                text: 'Cancel',
                handler: () => {
                  console.log('Cancel pressed');
                }
              },
              {
                text: 'SignUp',
                handler: () => {
                  this.navCtrl.push(SignupPage);
                }
              },
              {
                text: 'LogIn',
                handler: () => {
                  this.navCtrl.push(LoginPage);
                }
              }
            ]
          });
          confirm.present();
        }
      });
    }
  }

  addToWhishlist() {
    if (this.user) {
      this.userService.addToWhishlist(this.user.accounts_id, this.property.hotel_id, this.property.module).subscribe(res => {
        this.isWishList = res;
        if (this.isWishList) {
          let toast = this.toastController.create({
            message: 'Accommodation added to wishlist',
            duration: 1500,
            position: 'bottom'
          });
          toast.present();
        }
      });
    } else {
      let confirm = this.alertCtrl.create({
        title: 'You are not logged in...',
        message: 'If you\'re not logged into the app you can\'t add this property to your wishlist. Go LogIn or SignUp if you don\'t have any aacount yet.',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              console.log('Cancel pressed');
            }
          },
          {
            text: 'SignUp',
            handler: () => {
              this.navCtrl.push(SignupPage);
            }
          },
          {
            text: 'LogIn',
            handler: () => {
              this.navCtrl.push(LoginPage);
            }
          }
        ]
      });
      confirm.present();
    }

  }

  removeFromWishlist() {
    this.userService.removeFromWhishlist(this.user.accounts_id, this.property.hotel_id).subscribe(res => {
      this.isWishList = !res;
      console.log('this.isWishList: ', this.isWishList);
      if (res) {
        let toast = this.toastController.create({
          message: 'Accommodation removed from wishlist',
          duration: 1500,
          position: 'bottom'
        });
        toast.present();
      }
    });
  }

  goHome() {
    this.navCtrl.popToRoot();
  }

}

@Component({
  selector: 'imagesModal',
  template: `
  <ion-header>
    <ion-toolbar>
        <ion-title> <ion-icon name="images"></ion-icon> Images</ion-title>
        <ion-buttons start>
            <button ion-button (click)="dismiss()">
            <span ion-text color="primary" showWhen="ios">Cancel</span>
            <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
          </button>
        </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>

    <ion-slides loop="true" pager="true" zoom="true" paginationType="progress">
      <ion-slide *ngFor="let image of images">
        <ion-icon id="backSlideArrowIcon" name="ios-arrow-dropleft" (click)="goPreviousSlide()"></ion-icon>
        <img [src]="image">
        <ion-icon id="forwardSlideArrowIcon" name="ios-arrow-dropright" (click)="goNextSlide()"></ion-icon>
      </ion-slide>
    </ion-slides>

  </ion-content>
  `
})

export class ImagesModal {

  images: any[];
  @ViewChild(Slides) slides: Slides;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController) {
    this.images = this.params.data.images;
  }

  goPreviousSlide() {
    this.slides.slidePrev();
  }
  goNextSlide() {
    this.slides.slideNext();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
