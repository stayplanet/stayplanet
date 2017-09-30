import { Component, ViewChild} from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';

import { HomePage, LoginPage, SignupPage } from '../pages/pages';

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

  refreshUser(){
    if(this.platform.is('cordova')){
      this.nativeStorage.getItem('user').then(user => {
        this.user = user;
      });
    }
  }

  loginTapped(){
    this.nav.push(LoginPage);
  }
  signupTapped(){
    this.nav.push(SignupPage);
  }

}
