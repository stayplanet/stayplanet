import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { AccountPage, UserPage } from '../pages';

@Component({
  selector: 'dashboardPage',
  templateUrl: 'dashboardPage.html',
})
export class DashboardPage {

  user: any;
  newMessages: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastController: ToastController
  ) {
  }

  ionViewDidLoad() {
    this.user = this.navParams.data;
  }

  goToAccountPage() {
    this.navCtrl.push(AccountPage, this.user);
  }

  sendNewConfirmationEmail(){
    let toast = this.toastController.create({
      message: 'Send confirmation email again',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
    return false;
  }

  goToProfile(){
    this.navCtrl.push(UserPage, this.user);
  }

  goHome() {
    this.navCtrl.popToRoot();
  }

}
