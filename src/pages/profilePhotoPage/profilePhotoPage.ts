import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { ImagePicker } from '@ionic-native/image-picker';

import { UserService } from '../../services/userService';

@Component({
  selector: 'profilePhotoPage',
  templateUrl: 'profilePhotoPage.html',
})
export class ProfilePhotoPage {

  user: any;
  userGender: string;
  uploadUrl: string = 'http://francisco.stayplanet.ie/api/uploadImage';
  userImage: string = undefined;
  imagePath: string;
  imageName: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker,
    private file: File,
    private filePath: FilePath,
    private userService: UserService
  ) {
  }

  ionViewDidLoad() {
    this.user = this.navParams.data;
    this.userGender = this.user.gender;
  }

  openImageChooser() {
    let imagePickerOptions = {
      maximumImagesCount: 1,
      quality: 99,
    }
    this.imagePicker.getPictures(imagePickerOptions).then(result => {
      this.imagePath = result[0];
      this.userImage = this.imagePath;
      this.filePath.resolveNativePath(this.imagePath)
        .then(filePath => {
          this.imagePath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          this.imageName = filePath.substring(filePath.lastIndexOf('/') + 1);
          console.log("imageName: ", this.imageName);
        });
    }, error => {
      console.log(error);
    });
  }

  uploadImage() {
    let loading = this.loadingController.create({
      content: 'Uploading image...',
    });
    loading.present();

    var options = {
      fileKey: "file",
      fileName: this.imageName,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: { 'fileName': this.imageName }
    };
    let fullImagePath = this.imagePath + this.imageName;
    this.userService.uploadImage(fullImagePath, this.uploadUrl, options, this.user.email).then(boolean => {
      loading.dismissAll();
      if (boolean) {
        let toast = this.toastController.create({
          message: 'Image succesful uploaded',
          duration: 1500,
          position: 'bottom'
        });
        toast.present();
      } else {
        let toast = this.toastController.create({
          message: 'Error while uploading file',
          duration: 1500,
          position: 'bottom'
        });
        toast.present();
      }

    });
  }

}