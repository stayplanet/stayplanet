import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, Platform, ViewController } from 'ionic-angular';

import { DatabaseService } from '../../services/databaseService';

@Component({
  selector: 'cityPage',
  templateUrl: 'cityPage.html',
})
export class CityPage {

  idCity: number;
  city: any;
  checkInDate: string = "Check In";
  checkOutDate: string = "Check Out";
  guests: number = 1;
  roomTypes: any[] = ["Private Room", "Common Room", "Shared Room"];
  price: any = {
    upper: 1000,
    lower: 0
  }
  roomTypesSelected: any[];
  moreFilters: boolean = false;

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

  changeMoreFilters(){
    this.moreFilters = !this.moreFilters;
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