import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, NavParams, Slides, ViewController } from 'ionic-angular';


@Component({
  selector: 'propertyPage',
  templateUrl: 'propertyPage.html',
})
export class PropertyPage {

  property: any = {}

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {
    this.property = this.navParams.data;
    console.log(this.property);
  }

  openImagesModal() {
    let imagesModal = this.modalCtrl.create(ImagesModal, { images: this.property.image });
    imagesModal.present();
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
