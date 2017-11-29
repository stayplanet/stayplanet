import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';

import { HomePage, LoginPage, SignupPage, SettingsPage, DashboardPage, AccountPage, InboxPage, ListingsPage, TripsPage, PartnersPage, NewsletterPage, WishlistPage, ContactPage } from '../pages/pages';

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
      title: 'Do you want to logout?',
      message: 'We hope you see you soon',
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
    this.nav.push(SettingsPage, this.user);
  }
  dashboardTapped(){
    this.nav.push(DashboardPage, this.user);
  }
  accountTapped(){
    this.nav.push(AccountPage);
  }
  inboxTapped(){
    this.nav.push(InboxPage);
  }
  newsletterTapped(){
    this.nav.push(NewsletterPage, this.user);
  }
  listingsTapped(){
    this.nav.push(ListingsPage, this.user);
  }
  tripsTapped(){
    this.nav.push(TripsPage);
  }
  wishlistTapped(){
    this.nav.push(WishlistPage, this.user);
  }
  partnersTapped(){
    this.nav.push(PartnersPage);
  }
  contactTapped(){
    this.nav.push(ContactPage, this.user);
  }

}
