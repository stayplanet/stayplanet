import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//import firebase from 'firebase';

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
    public splashScreen: SplashScreen) {

    /*
    firebase.initializeApp({
      apiKey: "AIzaSyBSnwmbXM4CsbkObaSJmz4sETdjWcULnSw",
      authDomain: "stayplanet-943d2.firebaseapp.com",
      databaseURL: "https://stayplanet-943d2.firebaseio.com",
      projectId: "stayplanet-943d2",
      storageBucket: "stayplanet-943d2.appspot.com",
      messagingSenderId: "286617130799"
    });
    this.initializeApp();
    */
    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  loginTapped(){
    this.nav.push(LoginPage);
  }
  signupTapped(){
    this.nav.push(SignupPage);
  }

}
