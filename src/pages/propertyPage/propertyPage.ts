import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'propertyPage',
  templateUrl: 'propertyPage.html',
})
export class PropertyPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PropertyPage');
  }

  goHome(){
    this.navCtrl.popToRoot();
  }

}
