import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FileChooser } from '@ionic-native/file-chooser';

@Component({
  selector: 'profilePhotoPage',
  templateUrl: 'profilePhotoPage.html',
})
export class ProfilePhotoPage {

  user: any;
  userGender: string;
  userImage: string = undefined;
  uri: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fileChooser: FileChooser
  ) {
  }

  ionViewDidLoad() {
    this.user = this.navParams.data;
    this.userGender = this.user.gender;
  }

  openFileChooser(){
    this.fileChooser.open()
    .then(uri => {
      this.uri = uri;
      console.log(uri);
    })
    .catch(e => console.log(e));
  }

}
