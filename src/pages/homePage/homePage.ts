import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, Content } from 'ionic-angular';

import { PropertiesPage, PropertyPage } from '../../pages/pages';

import { DatabaseService } from '../../services/databaseService';

import * as _ from 'lodash';
import { DatePicker } from '../../Component/date-picker';

@Component({
  selector: 'homePage',
  templateUrl: 'homePage.html',
  providers: [DatePicker]
})

export class HomePage {

  @ViewChild(Content) content: Content;

  splash: boolean = false;
  location: any;
  locations: any = [];
  searchedLocations: any = [];
  accommodation: any;
  accommodations: any = [];
  searchedAcco: any = [];

  featuredAcco = [];
  featuredAccoToShow = [];

  begin: boolean = true;
  //logoPath: string = "assets/logo.png";
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
    private datePicker: DatePicker
  ) {
  }

  ionViewDidLoad() {
    this.databaseService.getLocations().subscribe(locations => {
      this.locations = locations;
    });
    this.databaseService.getAccommodations().subscribe(accommodations => {
      this.accommodations = accommodations;
      this.getFeaturedAccommodations();
    });
    setTimeout(() => {
      this.splash = false;
    }, 7500);
  }

  ionViewWillEnter() {
    if (!this.begin) {
      this.getFeaturedAccommodations();
    }
  }

  imageLoaded() {
    this.loadedImages++;
    if (this.loadedImages = this.featuredAccoToShow.length) {
      this.splash = false;
    }
  }

  getFeaturedAccommodations() {
    this.begin = false;
    this.featuredAcco = _.filter(this.accommodations, { 'hotel_is_featured': 'yes' });
    this.featuredAccoToShow = [];
    for (var i = 0; i < 10; i++) {
      let random = Math.floor(Math.random() * this.featuredAcco.length);

      if (!this.featuredAcco[random].thumbnail_image.includes('http://')) {
        this.featuredAcco[random].thumbnail_image = 'http://www.stayplanet.net/uploads/images/hotels/slider/' + this.featuredAcco[random].thumbnail_image;
      }

      if (!this.featuredAcco[random].hotel_stars) {
        this.featuredAcco[random].hotel_stars = 0;
      } else {
        this.featuredAcco[random].hotel_stars = parseInt(this.featuredAcco[random].hotel_stars);
      }
      this.featuredAcco[random]['stars'] = Array(this.featuredAcco[random].hotel_stars);
      this.featuredAcco[random]['noStars'] = Array(5 - this.featuredAcco[random].hotel_stars);

      this.featuredAccoToShow.push(this.featuredAcco[random]);
    }
  }

  search(searchBar) {
    let pattern = searchBar.value;

    if (pattern && pattern.length > 3) {
      this.searchedAcco = _.filter(this.accommodations, acco => {
        let accoTitleLower = acco.hotel_title.toLowerCase();
        if (accoTitleLower.includes(pattern.toLowerCase())) {
          return acco;
        }
      });
      this.searchedLocations = _.filter(this.locations, location => {
        let locationNameLower = location.location.toLowerCase();
        if (locationNameLower.includes(pattern.toLowerCase())) {
          return location;
        }
      });
    } else {
      this.searchedLocations = [];
      this.searchedAcco = [];
    }
  }
  clearSearchBar(searchBar){
    searchBar.value = '';
    this.accommodation = undefined;
    this.location = undefined;
    this.searchedLocations = [];
    this.searchedAcco = [];
  }

  accommodationTapped(accommodation, searchBar) {
    searchBar.value = accommodation.hotel_title;
    this.accommodation = accommodation;
    this.location = undefined;
    this.searchedLocations = [];
    this.searchedAcco = [];
  }
  locationTapped(location, searchBar) {
    searchBar.value = location.location;
    this.accommodation = undefined;
    this.location = location;
    this.searchedLocations = [];
    this.searchedAcco = [];
  }
  featuredAccoTapped(accommodation, searchBar) {
    searchBar.value = accommodation.hotel_title;
    this.accommodation = accommodation;
    this.location = undefined;
    this.searchedLocations = [];
    this.searchedAcco = [];
    this.content.scrollToTop();
    this.showCalendar('IN');
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
    if ((!this.location || this.location.location == '') && (!this.accommodation || this.accommodation.hotel_title == '')) {
      let toast = this.toastController.create({
        message: 'You must select a location or an accommodation',
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

    if (this.location) {
      this.navCtrl.push(PropertiesPage, { "location": this.location, "filters": this.filters, "guests": this.guests });
    } else {
      this.navCtrl.push(PropertyPage, { "property": this.accommodation, "filters": this.filters, "guests": this.guests });
    }

  }

  goToCity(idCity) {
    //this.navCtrl.push(CityPage, idCity);
    console.log(idCity);
  }
}
