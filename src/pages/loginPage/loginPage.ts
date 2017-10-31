import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import {Md5} from 'ts-md5/dist/md5';

import { SignupPage } from '../pages';

import { UserService } from '../../services/userService';

@Component({
  selector: 'loginPage',
  templateUrl: 'loginPage.html',
})
export class LoginPage {

  user: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastController: ToastController,
    private userService: UserService
  ) {
  }

  ionViewDidLoad() {
  }

  login(email, password) {
    var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regExp.test(email)) {
      let toast = this.toastController.create({
        message: 'Not a valid email address',
        duration: 1500,
        position: 'bottom'
      });
      toast.present();
      return false;
    }
    if (password == ''){
      let toast = this.toastController.create({
        message: 'Empty password',
        duration: 1500,
        position: 'bottom'
      });
      toast.present();
      return false;
    }

    this.userService.login(email, Md5.hashStr(password)).subscribe(user => {
      if(user){
        this.navCtrl.popToRoot();
      }else if (!user){
        let toast = this.toastController.create({
          message: 'Invalid email or wrong password',
          duration: 1500,
          position: 'bottom'
        });
        toast.present();
        return false;
      }
    });

  }

  goToSignup() {
    this.navCtrl.push(SignupPage);
  }

  goHome() {
    this.navCtrl.popToRoot();
  }

}