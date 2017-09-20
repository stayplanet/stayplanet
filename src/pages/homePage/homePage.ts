import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { CityPage } from '../../pages/pages';

import { DatabaseService } from '../../services/databaseService';

import * as _ from 'lodash';

@Component({
  selector: 'homePage',
  templateUrl: 'homePage.html'
})

export class HomePage {

  cities: any = [];
  TDcities: any = [];
  TDcitiesToShow: any;
  begin: boolean = true;

  constructor(
    public navCtrl: NavController,
    private loadingController: LoadingController,
    private databaseService: DatabaseService) {
  }

  ionViewDidLoad() {
    let loader = this.loadingController.create({
      content: 'Please wait...',
      spinner: 'bubbles',
      cssClass: 'loadingController'
    });
    loader.present().then(() => {
      this.databaseService.getCities().subscribe(cities => {
        this.cities = cities;
        this.getTopDestinationCities();
        loader.dismiss();
      });
    });
  }

  ionViewWillEnter() {
    if (!this.begin) {
      this.getTopDestinationCities();
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

  goToCity(idCity){
    this.navCtrl.push(CityPage, idCity);
  }

}
