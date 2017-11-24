import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, ToastController } from 'ionic-angular';

import { UserService } from '../../services/userService';

@Component({
  selector: 'invoicePage',
  templateUrl: 'invoicePage.html',
})
export class InvoicePage {

  //room: any;
  user: any;
  booking: any;
  booking_date: string;
  booking_expiry: string;
  expired: boolean;
  creditCardDetails: any;
  todayString: string;
  tomorrowString: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private userService: UserService
  ) {
  }

  ionViewDidLoad() {
    this.user = this.navParams.data.user;
    this.booking = this.navParams.data.booking;
    let date = new Date();
    let now = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
    now >= parseInt(this.booking.booking_expiry) * 1000 ? this.expired = true : this.expired = false;
  }
  
  openCreditCardModal() {
    let creditCardModal = this.modalCtrl.create(CreditCardModal);
    creditCardModal.onDidDismiss(creditCard => {
      this.creditCardDetails = {
        number: creditCard.number,
        expMonth: creditCard.expMonth,
        expYear: creditCard.expYear,
        cvc: creditCard.cvc,
      };
      this.userService.createCardToken(
        this.creditCardDetails, this.booking.booking_subitem.price, this.booking.booking_id, this.booking.booking_ref_no, this.user.ai_first_name, this.user.ai_last_name
      ).then(result => {
        if (result) {
          let toast = this.toastController.create({
            message: 'Invoice paid',
            duration: 1500,
            position: 'bottom'
          });
          toast.present();
        }
      });
    });
    creditCardModal.present();
  }

  goHome() {
    this.navCtrl.popToRoot();
  }

}

@Component({
  template: `
  <ion-header>
    <ion-toolbar>
        <ion-title><ion-icon name="card"></ion-icon> Credit Card Details:</ion-title>
        <ion-buttons start>
            <button ion-button (click)="cancel()">
            <span ion-text color="primary" showWhen="ios">Cancel</span>
            <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
          </button>
        </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content padding>

    <ion-list>

      <ion-item>
        <ion-label>First name</ion-label>
        <ion-input type="text" [(ngModel)]="creditCardName"></ion-input>
      </ion-item>
    
      <ion-item>
        <ion-label>Last name</ion-label>
        <ion-input type="text" [(ngModel)]="creditCardSurname"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label>Card number</ion-label>
        <ion-input type="number" [(ngModel)]="creditCardNumber"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label>Expiration Date</ion-label>
        <ion-datetime displayFormat="MM/YYYY" pickerFormat="MM/YYYY" [min]="minDate" [max]="maxDate" [(ngModel)]="creditCardExpirationDate"></ion-datetime>
      </ion-item>

      <ion-item>
        <ion-label>CCV</ion-label>
        <ion-input type="number" [(ngModel)]="creditCardCVC"></ion-input>
      </ion-item>

      <ion-item>
        <button ion-button (click)="dismiss()">Pay Now</button>
      </ion-item>

    </ion-list>

  </ion-content>
  `
})

export class CreditCardModal {

  creditCardName: string = '';
  creditCardSurname: string = '';
  creditCardNumber: string = '';
  creditCardExpirationDate: string = '';
  creditCardCVC: string = '';
  minDate: string = '';
  maxDate: string = '';

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private toastController: ToastController
  ) {

    let date = new Date();
    let aux = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
    this.minDate = aux.getFullYear() + '-' + aux.getMonth();
    aux = new Date(date.getFullYear() + 10, date.getMonth() + 1, date.getDate());
    this.maxDate = aux.getFullYear() + '-' + aux.getMonth();

  }


  dismiss() {
    this.creditCardName = 'Test';
    this.creditCardSurname = 'Perez';
    this.creditCardNumber = '4242424242424242';
    this.creditCardExpirationDate = '2022-10';
    this.creditCardCVC = '123';
    if (this.creditCardName == '' || this.creditCardSurname == '' || this.creditCardNumber == '' || this.creditCardExpirationDate == '' || this.creditCardCVC == '') {
      let toast = this.toastController.create({
        message: 'You must fill in all fields',
        duration: 1500,
        position: 'bottom'
      });
      toast.present();
      return false;
    } else {
      let expYear = parseInt(this.creditCardExpirationDate.split("-")[0]);
      let expMonth = parseInt(this.creditCardExpirationDate.split("-")[1]);
      this.viewCtrl.dismiss({ 'number': this.creditCardNumber, 'expMonth': expMonth, 'expYear': expYear, 'cvc': this.creditCardCVC });
    }

  }
  cancel() {
    this.viewCtrl.dismiss();
  }
}
