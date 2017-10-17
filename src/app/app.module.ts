import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { AgmCoreModule } from '@agm/core';
import { DatePicker } from '../Component/date-picker';

import { MyApp } from './app.component';
import {
  HomePage, LoginPage, SignupPage, AccountPage, DashboardPage, InboxPage, ListingsPage, PartnersPage, TripsPage, TermsAndConditions, PrivacyPolicy,
  CityPage, PropertiesPage, FiltersModal, PropertyPage, ImagesModal, SettingsPage, UserPage, ProfilePhotoPage
} from '../pages/pages';
import { DatabaseService } from '../services/databaseService';
import { UserService } from '../services/userService';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DatePicker,
    LoginPage,
    SignupPage,
    AccountPage,
    DashboardPage,
    InboxPage,
    ListingsPage,
    PartnersPage,
    TripsPage,
    TermsAndConditions,
    PrivacyPolicy,
    CityPage,
    PropertiesPage,
    FiltersModal,
    PropertyPage,
    ImagesModal,
    SettingsPage,
    UserPage,
    ProfilePhotoPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AgmCoreModule.forRoot(), //API KEY DE GOOGLE MAPS AQUI ;)
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp], 
  entryComponents: [
    MyApp,
    HomePage,
    DatePicker,
    LoginPage,
    SignupPage,
    AccountPage,
    DashboardPage,
    InboxPage,
    ListingsPage,
    PartnersPage,
    TripsPage,
    TermsAndConditions,
    PrivacyPolicy,
    CityPage,
    PropertiesPage,
    FiltersModal,
    PropertyPage,
    ImagesModal,
    SettingsPage,
    UserPage,
    ProfilePhotoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    DatabaseService,
    UserService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})

export class AppModule { }
