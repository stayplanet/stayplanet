import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { PropertiesPage } from '../../pages/pages'

import { DatabaseService } from '../../services/databaseService';

import { DatePicker } from '../../Component/date-picker';

@Component({
  selector: 'cityPage',
  templateUrl: 'cityPage.html',
  providers: [DatePicker]
})
export class CityPage {

  logoPath: string = "gs://stayplanet-943d2.appspot.com/logo.png";
  idCity: number;
  city: any;
  guests: number = 1;
  filters: any = {
    checkInDate: undefined,
    checkOutDate: undefined,
    "priceFilter": {},
  }
  roomTypesSelected: any[];
  map: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private datePicker: DatePicker,
    private databaseService: DatabaseService
  ) {
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

  showCalendar(inout) {
    if (!this.filters.checkInDate && inout == 'OUT') {
      inout = 'IN';
    }
    this.datePicker.showCalendar({ checkInDate: this.filters.checkInDate, checkOutDate: this.filters.checkOutDate, inout: inout });
    this.datePicker.onDateSelected.subscribe(data => {
      this.filters.checkInDate = data.checkInDate;
      this.filters.checkOutDate = data.checkOutDate;
      inout = '';
    });
  }

  searchProperties() {
    if (!this.city.name || this.city.name == '') {
      let toast = this.toastController.create({
        message: 'You must select a city',
        duration: 1500,
        position: 'bottom'
      });
      toast.present();
      return false;
    }
    if (!this.filters.checkInDate) {
      let toast = this.toastController.create({
        message: 'You must select a Check In date',
        duration: 1500,
        position: 'bottom'
      });
      toast.present();
      return false;
    }
    if (!this.filters.checkOutDate) {
      let toast = this.toastController.create({
        message: 'You must select a Check Out date',
        duration: 1500,
        position: 'bottom'
      });
      toast.present();
      return false;
    }
    this.navCtrl.push(PropertiesPage, { "city": this.city.name, "filters": this.filters, "guests": this.guests });
  }

  goHome() {
    this.navCtrl.popToRoot();
  }

}