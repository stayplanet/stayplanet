import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

import { CityPage } from '../../pages/pages';

import { DatabaseService } from '../../services/databaseService';

import * as _ from 'lodash';

@Component({
  selector: 'homePage',
  templateUrl: 'homePage.html'
})

export class HomePage {

  user: any = {};
  splash: boolean = false;
  cities: any = [];
  TDcities: any = [];
  TDcitiesToShow: any;
  begin: boolean = true;
  logoPath: string = "assets/logo.png";
  loadedImages: number = 0;

  constructor(
    public navCtrl: NavController,
    private databaseService: DatabaseService,
    private nativeStorage: NativeStorage,
    private platform: Platform
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

  goToCity(idCity) {
    this.navCtrl.push(CityPage, idCity);
  }

}
