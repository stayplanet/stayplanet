import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, NavParams, Slides, ViewController, LoadingController, AlertController } from 'ionic-angular';

import { BookingPage } from '../../pages/pages';

import { DatabaseService } from '../../services/databaseService';

@Component({
  selector: 'propertyPage',
  templateUrl: 'propertyPage.html',
})
export class PropertyPage {

  property: any = {};
  images: string[] = [];
  filters: any = {};
  guests: number = 1;
  nights: number = 1;
  reviews: any = [];
  seller: any = {};
  rooms: any = [];
  roomsQuantity: number = 1;
  extraBeds: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    private databaseService: DatabaseService,
  ) {
  }

  ionViewDidLoad() {
    let loader =  this.loadingController.create({
      content: 'Please wait...',
    });
    loader.present();

    this.property = this.navParams.data.property;
    this.filters = this.navParams.data.filters;
    this.guests = this.navParams.data.guests;
    
    let oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    let checkInDate = new Date(this.filters.checkInDate.year, this.filters.checkInDate.month, this.filters.checkInDate.day);
    let checkOutDate = new Date(this.filters.checkOutDate.year, this.filters.checkOutDate.month, this.filters.checkOutDate.day);
    this.nights = Math.round(Math.abs((checkInDate.getTime() - checkOutDate.getTime())/(oneDay)));

    this.databaseService.getPropertyImages(this.property.hotel_id).subscribe(images => {
      images.forEach(image => {
        this.images.push(image.himg_image);
      });
    });

    this.databaseService.getReviews(this.property.hotel_id).subscribe(reviews => {
      this.reviews = reviews;
      this.databaseService.getRooms(this.property.hotel_id, this.nights, this.filters.checkInDate, this.filters.checkOutDate).subscribe(rooms => {
        rooms.forEach(room => {
          if(room.thumbnail_image == 'blank.jpg'){
            room.thumbnail_image = this.property.thumbnail_image;
          }else if(!room.thumbnail_image.includes('http://')){
            room.thumbnail_image = 'http://www.stayplanet.net/uploads/images/slider/' + room.thumbnail_image;
          }
          this.databaseService.getRoomAvailability(room.room_id, this.filters.checkInDate, this.filters.checkOutDate).subscribe(res => {
            console.log("res", res);
          });
        });
        this.rooms = rooms;

        console.log("property: ", this.property);
        console.log("rooms: ", this.rooms);
        loader.dismiss();
      });
    });

    setTimeout(() => {
      loader.dismiss();
    }, 7500);
  }

  openImagesModal() {
    let imagesModal = this.modalCtrl.create(ImagesModal, { images: this.images });
    imagesModal.present();
  }

  selectNumberOfRooms(room_quantity) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Number of rooms');

    for (let i = 1; i <= room_quantity; i++) {
      if(i == 1){
        alert.addInput({
          type: 'radio',
          label: '1 room',
          value: i.toString(),
          checked: true
        });
      }else{
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

  selectExtraBeds(extra_beds, extra_bed_charges){
    let alert = this.alertCtrl.create();
    alert.setTitle('Extra beds');

    for (let i = 0; i <= extra_beds; i++) {
      if(i == 0){
        alert.addInput({
          type: 'radio',
          label: i.toString() + ' beds €' + i*extra_bed_charges,
          value: i.toString(),
          checked: false
        });
      }else if(i == 1){
        alert.addInput({
          type: 'radio',
          label: '1 bed €' + extra_bed_charges,
          value: i.toString(),
          checked: true
        });
      }else{
        alert.addInput({
          type: 'radio',
          label: i.toString() + ' beds €' + i*extra_bed_charges,
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

  book(room){
    console.log(room);
    //this.navCtrl.push(BookingPage);
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

  goPreviousSlide(){
    this.slides.slidePrev();
  }
  goNextSlide(){
    this.slides.slideNext();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
