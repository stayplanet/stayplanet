import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController, ModalController, Select } from 'ionic-angular';

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
  propertiesToShow: any[];
  images: any[];
  orderByOption: string = "lowestPrice";
  @ViewChild('orderSelect') orderSelect: Select;

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
          p["mainImage"] = p.image[0];
          p.price = parseFloat(p.price);
        });
        this.properties = _.orderBy(this.properties, "price", "asc");
        if (this.properties.length > 0) {
          this.priceRange = {
            upper: this.properties[this.properties.length - 1].price,
            lower: this.properties[0].price
          }
          this.filters.priceFilter = this.priceRange;
        }
        this.propertiesToShow = this.properties;
        loader.dismiss();
      });
    });
  }

  orderBy() {
    if (this.orderByOption == "lowestPrice") {
      this.propertiesToShow = _.orderBy(this.propertiesToShow, "price", "asc");
    } else if (this.orderByOption == "highestPrice") {
      this.propertiesToShow = _.orderBy(this.propertiesToShow, "price", "desc");
    }
  }

  openFiltersModal() {
    let filtersModal = this.modalCtrl.create(FiltersModal, { filters: this.filters, priceRange: this.priceRange });
    filtersModal.onDidDismiss(filters => {
      this.filters = filters;
      this.propertiesToShow = [];
      _.forEach(this.properties, p => {
        if (this.filters.priceFilter.upper >= p.price && p.price >= this.filters.priceFilter.lower) {

          if (_.find(this.filters.propertyFeatures.propertyTypes, { value: true })){
            if (_.find(this.filters.propertyFeatures.propertyTypes, { name: p.room_type, value: true })) {
              this.propertiesToShow.push(p);
            }
          }else{
            this.propertiesToShow.push(p);
          }
        }
      });
    });
    filtersModal.present();
  }

  openOrderSelect() {
    this.orderSelect.open();
  }

  goToProperty(property) {
    this.navCtrl.push(PropertyPage, property);
  }

  goHome() {
    this.navCtrl.popToRoot();
  }

}

@Component({
  template: `
  <ion-header>
    <ion-toolbar>
        <ion-title><ion-icon name="options"></ion-icon> Filter by:</ion-title>
        <ion-buttons start>
            <button ion-button (click)="cancel()">
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
          <ion-select multiple="true" okText="Ok" cancelText="Cancel" #roomTypes (ionChange)="updateFilerValue('roomTypes', roomTypes.value)">
            <ion-option *ngFor="let roomType of filters.propertyFeatures.roomTypes" [selected]=roomType.value>{{ roomType.name }}</ion-option>
          </ion-select>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col>
        <ion-item>
          <ion-label>Property Type</ion-label>
          <ion-select multiple="true" okText="Ok" cancelText="Cancel" #propertyType (ionChange)="updateFilerValue('propertyTypes', propertyType.value)">
            <ion-option *ngFor="let propertyType of filters.propertyFeatures.propertyTypes" [selected]=propertyType.value>{{ propertyType.name }}</ion-option>
          </ion-select>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col>
        <ion-item>
          <ion-label>Amenities</ion-label>
          <ion-select multiple="true" okText="Ok" cancelText="Cancel" #amenities (ionChange)="updateFilerValue('amenities', amenities.value)">
            <ion-option *ngFor="let amenitie of filters.propertyFeatures.amenities" [selected]=amenitie.value>{{ amenitie.name }}</ion-option>
          </ion-select>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col>
        <ion-item>
          <ion-label>Extras</ion-label>
          <ion-select multiple="true" okText="Ok" cancelText="Cancel" #extras (ionChange)="updateFilerValue('extras', extras.value)">
            <ion-option *ngFor="let extra of filters.propertyFeatures.extras" [selected]=extra.value>{{ extra.name }}</ion-option>
          </ion-select>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col>
        <ion-item>
          <ion-label>Special Features</ion-label>
          <ion-select multiple="true" okText="Ok" cancelText="Cancel" #specialFeature (ionChange)="updateFilerValue('specialFeatures', specialFeature.value)">
            <ion-option *ngFor="let specialFeature of filters.propertyFeatures.specialFeatures" [selected]=specialFeature.value>{{ specialFeature.name }}</ion-option>
          </ion-select>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col>
        <ion-item>
          <ion-label>Price: {{ filters.priceFilter.lower | currency:'EUR':true:'1.2-2' }} - {{ filters.priceFilter.upper | currency:'EUR':true:'1.2-2' }}</ion-label>
          <ion-range [min]="priceRange.lower" [max]="priceRange.upper" step="1" pin="true" dualKnobs="true" [(ngModel)]="filters.priceFilter">
            <ion-icon range-left name="remove"></ion-icon>
            <ion-icon range-right name="add"></ion-icon>
          </ion-range>
        </ion-item>
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col>
        <button ion-button icon-end (click)="cancel()">Cancel<ion-icon name="close"></ion-icon></button>
      </ion-col>
      <ion-col>
        <button ion-button icon-end (click)="dismiss()">Filter<ion-icon name="checkmark"></ion-icon></button>
      </ion-col>
    </ion-row>

  </ion-content>
  `
})

export class FiltersModal {

  filters: any = {};
  priceRange: any = {};

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController) {
    this.filters = this.params.data.filters;
    this.priceRange = this.params.data.priceRange;
  }

  updateFilerValue(propertyFeature, names) {
    _.forEach(this.filters.propertyFeatures[propertyFeature], propertyFeature => {
      if (names.indexOf(propertyFeature.name) > -1) {
        propertyFeature.value = true;
      } else {
        propertyFeature.value = false;
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss(this.filters);
  }
  cancel() {
    this.viewCtrl.dismiss(this.params.data.filters);
  }
}