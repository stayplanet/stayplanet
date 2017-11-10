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
  userImage: string = undefined;
  imagePath: string;
  imageName: string;
  loader: any;

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
    this.user = this.navParams.data;
    this.userGender = this.user.gender;
    if (this.user.ai_image) {
      this.userImage = 'http://www.stayplanet.net/uploads/images/users/' + this.user.ai_image;
    }else{
      this.userImage = 'http://www.stayplanet.net/uploads/global/default/user.png';
    }
  }

  ionViewDidLoad() {
    this.loader = this.loadingController.create({
      content: 'Please wait...',
    });
    this.loader.present();
    setTimeout(() => {
      this.loader.dismiss();
    }, 7500);
  }

  imageLoaded(){
    this.loader.dismissAll();
  }

  openImageChooser() {
    let imagePickerOptions = {
      maximumImagesCount: 1,
      quality: 99,
    }

    this.imagePicker.getPictures(imagePickerOptions).then(result => {
      if (result.length > 0) {
        if (this.imagePath && this.imageName) {
          this.file.removeFile(this.imagePath, this.imageName).then(remove => {
            this.userImage = result[0];
            this.resolveNativePath(result[0]);
          }, error => {
            console.log("remove error: ", error);
          });
        } else {
          this.userImage = result[0];
          this.resolveNativePath(result[0]);
        }
      } else {
        return false; //cancel button
      }
    }, error => {
      console.log("getPictures error: ", error);
    });
  }

  resolveNativePath(path) {
    this.filePath.resolveNativePath(path).then(filePath => {
      this.imagePath = filePath.substring(0, filePath.lastIndexOf('/') + 1);
      this.imageName = filePath.substring(filePath.lastIndexOf('/') + 1);
      let extension = this.imageName.substring(this.imageName.lastIndexOf('.'));
      this.file.moveFile(this.imagePath, this.imageName, this.imagePath, this.user.accounts_email + extension).then(data => {
        this.imageName = this.user.accounts_email + extension;
      });
    });
  }

  uploadImage() {
    if(!this.imagePath || !this.imageName){
      let toast = this.toastController.create({
        message: 'You must select an image to save',
        duration: 1500,
        position: 'bottom'
      });
      toast.present();
      return false;
    }
    this.loader = this.loadingController.create({
      content: 'Uploading image...',
    });
    this.loader.present();

    var options = {
      fileKey: "file",
      fileName: this.imageName,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: { 'fileName': this.imageName }
    };

    this.userService.uploadImage(this.imagePath + this.imageName, options, this.user.accounts_email).then(boolean => {
      this.loader.dismissAll();
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