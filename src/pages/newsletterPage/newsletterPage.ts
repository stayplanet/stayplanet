import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { UserService } from '../../services/userService';

@Component({
  selector: 'newsletterPage',
  templateUrl: 'newsletterPage.html',
})
export class NewsletterPage {

  user: any;
  newsletter: any;
  bell: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastController: ToastController,
    private userService: UserService
  ) {

  }

  ionViewDidLoad() {
    this.user = this.navParams.data;
    this.userService.getNewsLetter(this.user.accounts_email).subscribe(result => {
      if (result.length == 0) {
        this.newsletter = {};
        this.bell = false;
      } else {
        this.newsletter = result;
        this.bell = true;
      }
    });
  }

  setNewsletter(toggle) {
    this.bell = !this.bell;
    this.userService.setNewsletter(this.user.accounts_email, toggle.value).subscribe(result => {
      if (result && toggle.value) {
        let toast = this.toastController.create({
          message: 'You have subscribed to our newsletters',
          duration: 1500,
          position: 'bottom'
        });
        toast.present();
      }else if(result && !toggle.value){
        let toast = this.toastController.create({
          message: 'You have unsubscribed to our newsletters',
          duration: 1500,
          position: 'bottom'
        });
        toast.present();
      }
    });
  }

  goHome() {
    this.navCtrl.popToRoot();
  }

}
