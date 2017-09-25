import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform, ViewController, ModalController } from 'ionic-angular';

import * as _ from 'lodash';

import { PropertyPage } from '../../pages/pages';

import { DatabaseService } from '../../services/databaseService';

@Component({
  selector: 'propertiesPage',
  templateUrl: 'propertiesPage.html',
})
export class PropertiesPage {

  city: string;
  priceRange: any = {};
  filters: any = {};
  orderSelectOptions = { title: 'Order By' };
  filterSelectOptions = { title: 'Filter By' };
  properties: any[];
  images: any[];
  orderByOption: string = "lowestPrice";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
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
      this.filters.propertyFeatures = this.dataBaseService.getPropertyFeatures();

      this.dataBaseService.searchCityProperties(this.city).subscribe(properties => {
        this.properties = properties;
        this.properties = _.forEach(this.properties, p => {
          let images = _.split(p.image, '"');
          p.image = _.filter(images, i => {
            if (/http*/.test(i)) { return i }
          });
          p["mainImage"] = p.image[Math.floor(Math.random() * p.image.length)];
          p.price = parseFloat(p.price);
        });
        this.properties = _.orderBy(this.properties, "price", "asc");
        this.priceRange = {
          upper: this.properties[this.properties.length-1].price,
          lower: this.properties[0].price
        }
        loader.dismiss();
      });
    });
  }

  orderBy() {
    if (this.orderByOption == "lowestPrice") {
      this.properties = _.orderBy(this.properties, "price", "asc");
    } else if (this.orderByOption == "highestPrice") {
      this.properties = _.orderBy(this.properties, "price", "desc");
    }
  }

  openFiltersModal() {
    let filtersModal = this.modalCtrl.create(FiltersModal, {filters: this.filters, priceRange: this.priceRange});
    filtersModal.onDidDismiss(data => {
      console.log(data);
    });
    filtersModal.present();
  }


  goToProperty(property) {
    this.navCtrl.push(PropertyPage);
  }

  goHome() {
    this.navCtrl.popToRoot();
  }

}

@Component({
  template: `
  <ion-header>
    <ion-toolbar>
        <ion-title>Filter by:</ion-title>
        <ion-buttons start>
            <button ion-button (click)="dismiss(1)">
            <span ion-text color="primary" showWhen="ios">Cancel</span>
            <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
          </button>
        </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>

    <ion-row>
      <ion-col>
        <ion-item>
          <ion-label>Room Type</ion-label>
          <ion-select multiple="true" okText="Ok" cancelText="Cancel">
            <ion-option *ngFor="let roomType of filters.propertyFeatures.roomTypes">{{ roomType.name }}</ion-option>
          </ion-select>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col>
        <ion-item>
          <ion-label>Property Type</ion-label>
          <ion-select multiple="true" okText="Ok" cancelText="Cancel">
            <ion-option *ngFor="let propertyType of filters.propertyFeatures.propertyTypes">{{ propertyType.name }}</ion-option>
          </ion-select>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col>
        <ion-item>
          <ion-label>Amenities</ion-label>
          <ion-select multiple="true" okText="Ok" cancelText="Cancel">
            <ion-option *ngFor="let amenitie of filters.propertyFeatures.amenities">{{ amenitie.name }}</ion-option>
          </ion-select>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col>
        <ion-item>
          <ion-label>Extras</ion-label>
          <ion-select multiple="true" okText="Ok" cancelText="Cancel">
            <ion-option *ngFor="let extra of filters.propertyFeatures.extras">{{ extra.name }}</ion-option>
          </ion-select>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col>
        <ion-item>
          <ion-label>Special Features</ion-label>
          <ion-select multiple="true" okText="Ok" cancelText="Cancel">
            <ion-option *ngFor="let specialFeature of filters.propertyFeatures.specialFeatures">{{ specialFeature.name }}</ion-option>
          </ion-select>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col>
        <ion-item>
          <ion-label>Price: {{ filters.priceFilter.lower }} - {{ filters.priceFilter.upper }}</ion-label>
          <ion-range [min]="priceRange.lower" [max]="priceRange.upper" step="1" pin="true" dualKnobs="true" [(ngModel)]="filters.priceFilter">
            <ion-icon range-left name="remove"></ion-icon>
            <ion-icon range-right name="add"></ion-icon>
          </ion-range>
        </ion-item>
      </ion-col>
    </ion-row>

  </ion-content>
  `
})

export class FiltersModal {

  filters: any = {};
  priceRange: any = {};

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController) {
    this.filters = this.params.data.filters;
    this.priceRange = this.params.data.priceRange;
    this.filters.priceFilter = this.priceRange;
    console.log(this.filters);
    console.log(this.priceRange);

  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
}