import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AgmCoreModule } from '@agm/core';

import * as _ from 'lodash';

import { DatabaseService } from '../../services/databaseService';

@Component({
  selector: 'propertiesPage',
  templateUrl: 'propertiesPage.html',
})
export class PropertiesPage {

  city: string;
  filters: any = {};
  properties: any[];
  images: any[];
  arrowPriceIcon: string = "arrow-dropup-circle";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingController: LoadingController,
    private dataBaseService: DatabaseService) {
    this.city = this.navParams.data.city;
    this.filters = this.navParams.data.filters;
  }

  ionViewDidLoad() {
    let loader = this.loadingController.create({
      content: 'Searching properties',
      spinner: 'bubbles',
      cssClass: 'loadingController'
    });

    loader.present().then(() => {
      this.dataBaseService.searchCityProperties(this.city).subscribe(properties => {
        this.properties = properties;
        this.properties = _.filter(this.properties, p => {
          let images = _.split(p.image, '"');
          p.image = _.filter(images, i => {
            if (/http*/.test(i)) { return i }
          });
          p["mainImage"] = p.image[Math.floor(Math.random() * p.image.length)];
          p.price = parseFloat(p.price);
          if (this.filters.priceFilter.upper >= p.price && p.price >= this.filters.priceFilter.lower) {
            return p;
          }
        });
        this.properties = _.orderBy(this.properties, "price", "asc");
        loader.dismiss();
      });
    });
  }

  orderByPrice() {
    if (this.arrowPriceIcon == "arrow-dropdown-circle") {
      this.arrowPriceIcon = "arrow-dropup-circle";
      this.properties = _.orderBy(this.properties, "price", "asc");
    } else {
      this.arrowPriceIcon = "arrow-dropdown-circle";
      this.properties = _.orderBy(this.properties, "price", "desc");
    }
  }

  goHome() {
    this.navCtrl.popToRoot();
  }


}