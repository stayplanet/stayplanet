import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { UserService } from '../../services/userService';

@Component({
  selector: 'newsletterPage',
  templateUrl: 'newsletterPage.html',
})
export class NewsletterPage {

  user: any;
  newsletter: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserService
  ) {
    
  }

  ionViewDidLoad() {
    this.user = this.navParams.data;
    this.userService.getNewsLetter(this.user.accounts_email).subscribe(result => {
      if(result.length == 0){
        this.newsletter = {};
      }else{
        this.newsletter = result;
      }
      
    });
  }

  setNewsletter(toggle){
    this.userService.setNewsletter(this.user.accounts_email, toggle.value).subscribe(result => {
      if(result){
        console.log('cambia');
      }else{
        console.log('no lo hizo');
      }
    });
  }

  goHome() {
    this.navCtrl.popToRoot();
  }

}
