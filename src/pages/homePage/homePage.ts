import { Component } from '@angular/core';
import { NavController, Platform, ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { CityPage } from '../../pages/pages';

import { DatabaseService } from '../../services/databaseService';

import * as _ from 'lodash';
import { DatePicker } from '../../Component/date-picker';

@Component({
  selector: 'homePage',
  templateUrl: 'homePage.html',
  providers: [DatePicker]
})

export class HomePage {

  splash: boolean = false;
  cities: any = [];
  TDcities: any = [];
  TDcitiesToShow: any;
  cityName: string;
  searchedCities: any = [];
  begin: boolean = true;
  logoPath: string = "assets/logo.png";
  loadedImages: number = 0;
  guests: number = 1;
  filters: any = {
    checkInDate: undefined,
    checkOutDate: undefined
  }
  searchbarOptions = {
    placeholder: "Where do you want to go?",
    autocomplete: "on"
  }

  constructor(
    public navCtrl: NavController,
    private toastController: ToastController,
    private databaseService: DatabaseService,
    private nativeStorage: NativeStorage,
    private platform: Platform,
    private datePicker: DatePicker
  ) {
  }

  ionViewDidLoad() {
    this.databaseService.getCities().subscribe(cities => {
      this.cities = cities;
      this.getTopDestinationCities();
    });
    setTimeout(() => {
      this.splash = false;
    }, 7500);
  }

  ionViewWillEnter() {
    if (!this.begin) {
      this.getTopDestinationCities();
    }
  }

  imageLoaded() {
    this.loadedImages++;
    if (this.loadedImages = this.getTopDestinationCities.length) {
      this.splash = false;
    }
  }

  getTopDestinationCities() {
    this.begin = false;
    this.TDcities = _.filter(this.cities, { 'top_destination': '1' });
    this.TDcitiesToShow = [];
    let aux = this.TDcities;
    for (var i = 0; i < 10; i++) {
      let random = Math.floor(Math.random() * aux.length);
      this.TDcitiesToShow.push(aux.splice(random, 1)[0]);
    }
  }

  searchCities(searchBar) {
    let pattern = searchBar.value;

    if (pattern && pattern.length > 3) {
      this.searchedCities = _.filter(this.cities, city => {
        let cityNameLower = city.name.toLowerCase();
        if (cityNameLower.includes(pattern.toLowerCase())) {
          return city;
        }
      });
    } else {
      this.searchedCities = [];
    }
  }

  cityTapped(city, searchBar) {
    this.cityName = city.name;
    searchBar.value = city.name;
    this.searchedCities = [];
  }

  showCalendar(inout) {
    if(!this.filters.checkInDate && inout == 'OUT'){
      inout = 'IN';
    }
    this.datePicker.showCalendar( {checkInDate: this.filters.checkInDate, checkOutDate: this.filters.checkOutDate, inout: inout} );
    this.datePicker.onDateSelected.subscribe(data => {
      this.filters.checkInDate = data.checkInDate;
      this.filters.checkOutDate = data.checkOutDate;
      inout = '';
    });
  }

  searchProperties() {
    if (!this.cityName || this.cityName == ''){
      let toast = this.toastController.create({
        message: 'You must select a city',
        duration: 1500,
        position: 'bottom'
      });
      toast.present();
      return false;
    }
    if (!this.filters.checkInDate){
      let toast = this.toastController.create({
        message: 'You must select a Check In date',
        duration: 1500,
        position: 'bottom'
      });
      toast.present();
      return false;
    }
    if (!this.filters.checkOutDate){
      let toast = this.toastController.create({
        message: 'You must select a Check Out date',
        duration: 1500,
        position: 'bottom'
      });
      toast.present();
      return false;
    }
    console.log("explore");
  }

  goToCity(idCity) {
    this.navCtrl.push(CityPage, idCity);
  }

}
