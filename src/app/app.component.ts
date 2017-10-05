import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';

import { HomePage, LoginPage, SignupPage, UserPage, DashboardPage, AccountPage, InboxPage, ListingsPage, TripsPage, PartnersPage } from '../pages/pages';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  user: any;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private nativeStorage: NativeStorage,
    private alertController: AlertController,
    private events: Events
  ) {

    /*
    firebase.initializeApp({
      apiKey: "AIzaSyBSnwmbXM4CsbkObaSJmz4sETdjWcULnSw",
      authDomain: "stayplanet-943d2.firebaseapp.com",
      databaseURL: "https://stayplanet-943d2.firebaseio.com",
      projectId: "stayplanet-943d2",
      storageBucket: "stayplanet-943d2.appspot.com",
      messagingSenderId: "286617130799"
    });
    */
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.refreshUser();
    this.events.subscribe('user:changed', () => this.refreshUser());
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  refreshUser() {
    if (this.platform.is('cordova')) {
      console.log("hasta aqui");
      this.nativeStorage.getItem("user").then(user => {
        this.user = user;
      }).catch(error => {
        if(error.code == 2){ // ITEM NOT FOUND
          this.user = void 0;
        }
      });
    }
  }

  loginTapped() {
    this.nav.push(LoginPage);
  }
  logoutTapped() {
    const alert = this.alertController.create({
      title: 'Do you really want to logout?',
      message: 'some text here',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.nativeStorage.remove("user").then(() => {
              this.events.publish('user:changed');
            });
            //this.nav.popToRoot();
          }
        }
      ]
    });
    alert.present();
  }
  signupTapped() {
    this.nav.push(SignupPage);
  }
  userTapped() {
    this.nav.push(UserPage);
  }
  dashboardTapped(){
    this.nav.push(DashboardPage);
  }
  accountTapped(){
    this.nav.push(AccountPage);
  }
  inboxTapped(){
    this.nav.push(InboxPage);
  }
  listingsTapped(){
    this.nav.push(ListingsPage);
  }
  tripsTapped(){
    this.nav.push(TripsPage);
  }
  partnersTapped(){
    this.nav.push(PartnersPage);
  }

}
