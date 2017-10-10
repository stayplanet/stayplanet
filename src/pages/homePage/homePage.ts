import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
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

  user: any = {};
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
    private databaseService: DatabaseService,
    private nativeStorage: NativeStorage,
    private platform: Platform,
    private datePicker: DatePicker
  ) {
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.splash = false;
    }, 7500);
    this.databaseService.getCities().subscribe(cities => {
      this.cities = cities;
      this.getTopDestinationCities();
    });
  }

  ionViewWillEnter() {
    if (!this.begin) {
      this.getTopDestinationCities();
    }
    if (this.platform.is('cordova')) {
      this.nativeStorage.getItem('user').then(user => {
        this.user = user; //pa que?
      });
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

    if (pattern && pattern.length >= 3) {
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
    this.datePicker.onDateSelected.subscribe(date => {
      if (!this.filters.checkInDate || (this.filters.checkInDate && inout == 'IN')) {
        this.filters.checkInDate = date;
      } else if (inout == 'OUT') {
        this.filters.checkOutDate = date;
      }
      inout = '';
    });
  }

  searchProperties() {
  }

  goToCity(idCity) {
    this.navCtrl.push(CityPage, idCity);
  }

}
