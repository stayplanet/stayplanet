import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, Platform, ViewController } from 'ionic-angular';

import { PropertiesPage } from '../../pages/pages'

import { DatabaseService } from '../../services/databaseService';

@Component({
  selector: 'cityPage',
  templateUrl: 'cityPage.html',
})
export class CityPage {

  idCity: number;
  city: any;
  guests: number = 1;
  filters: any = {
    "checkInDate": "Check In",
    "checkOutDate": "Check Out",
    "priceFilter": {},
  }
  roomTypesSelected: any[];
  moreFilters: boolean = false;
  map: any = {};


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private databaseService: DatabaseService) {
    this.idCity = this.navParams.data;
  }

  ionViewDidLoad() {
    let loader = this.loadingController.create({
      content: 'Please wait...',
      spinner: 'bubbles',
      cssClass: 'loadingController'
    });
    loader.present().then(() => {
      this.databaseService.getCity(this.idCity).subscribe(city => {
        this.city = city;
        this.map = {
          lati: parseFloat(this.city.latitude),
          long: parseFloat(this.city.longitude),
          zoom: 10,
        };
        loader.dismiss();
      });
    });
  }

  openCheckInOutModal() {
    let checkInModal = this.modalCtrl.create(CheckInOutModal);
    checkInModal.onDidDismiss(data => {
      console.log(data);
    });
    checkInModal.present();
  }

  searchProperties() {
    this.navCtrl.push(PropertiesPage, { "city": this.city.name, "filters": this.filters });
  }

  goHome() {
    this.navCtrl.popToRoot();
  }

}


@Component({
  template: `
  <ion-header>
    <ion-toolbar>
        <ion-title>Check In-Out Dates</ion-title>
        <ion-buttons start>
            <button ion-button (click)="dismiss(1)">
            <span ion-text color="primary" showWhen="ios">Cancel</span>
            <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
          </button>
        </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    Pepito de los Palotes
  </ion-content>
  `
})
export class CheckInOutModal {

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController) {

  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
}

