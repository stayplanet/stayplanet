import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { UserService } from '../../services/userService';

@Component({
  selector: 'contactPage',
  templateUrl: 'contactPage.html',
})
export class ContactPage {

  user: any;
  name: string;
  email: string;
  subject: string = '';
  message: string = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastController: ToastController,
    private userService: UserService
  ) {
  }

  ionViewDidLoad() {
    this.user = this.navParams.data;
  }

  submitMessage() {
    if (this.name == '' || this.email == '' || this.subject == '' || this.message == '') {
      let toast = this.toastController.create({
        message: 'None of the fields could be blank',
        duration: 1500,
        position: 'bottom'
      });
      toast.present();
      return false;
    }
    let message = {
      'name': this.name,
      'email': this.email,
      'subject': this.subject,
      'message': this.message
    }
    this.userService.sendContactMessage(message).then(res => {
      if(res){
        let toast = this.toastController.create({
          message: 'Message sent succesfully',
          duration: 1500,
          position: 'bottom'
        });
        toast.present();
        this.subject = '';
        this.message = '';
      }else{
        let toast = this.toastController.create({
          message: 'The message couldn\'t been sent',
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
