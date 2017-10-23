import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, NavParams, Slides, ViewController, LoadingController } from 'ionic-angular';

import { BookingPage } from '../../pages/pages';

import { DatabaseService } from '../../services/databaseService';

@Component({
  selector: 'propertyPage',
  templateUrl: 'propertyPage.html',
})
export class PropertyPage {

  property: any = {}
  filters: any;
  guests: number;
  nights: number = 0;
  reviews: any = [];
  seller: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private databaseService: DatabaseService
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

    console.log(this.property);
    console.log(this.filters);
    console.log(this.guests);

    this.databaseService.getReviews(this.property.id).subscribe(reviews => {
      this.reviews = reviews;
      this.databaseService.getSeller(this.property.seller_product_id).subscribe(seller => {
        this.seller = seller;
        loader.dismiss();
      });
    });

    setTimeout(() => {
      loader.dismiss();
    }, 7500);
  }

  openImagesModal() {
    let imagesModal = this.modalCtrl.create(ImagesModal, { images: this.property.image });
    imagesModal.present();
  }

  book(){
    this.navCtrl.push(BookingPage);
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
