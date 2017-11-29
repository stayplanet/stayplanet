import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import * as sha1 from 'js-sha1';

import { SignupPage } from '../pages';

import { UserService } from '../../services/userService';

@Component({
  selector: 'loginPage',
  templateUrl: 'loginPage.html',
})
export class LoginPage {

  user: any = {};
  showPassword: boolean = false;
  iconName: string = "eye-off";
  passwordType: string = "password";

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

    this.userService.login(email, sha1(password)).subscribe(user => {
      if(user){
        this.navCtrl.popToRoot();
        let toast = this.toastController.create({
          message: 'Welcome ' + user.ai_first_name,
          duration: 2500,
          position: 'bottom'
        });
        toast.present();
      }else if (!user){
        let toast = this.toastController.create({
          message: 'Invalid email or wrong password',
          duration: 2500,
          position: 'bottom'
        });
        toast.present();
        return false;
      }
    });

  }

  changeShowPassword(){
    this.showPassword = !this.showPassword;
    this.showPassword ? this.iconName = "eye" : this.iconName = "eye-off";
    this.showPassword ? this.passwordType = "text" : this.passwordType = "password";
  }

  goToSignup() {
    this.navCtrl.push(SignupPage);
  }

  goHome() {
    this.navCtrl.popToRoot();
  }

}