import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

@Component({
  selector: 'invoicePage',
  templateUrl: 'invoicePage.html',
})
export class InvoicePage {

  //room: any;
  user: any;
  booking: any;
  todayString: string;
  tomorrowString: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {
    //this.room = this.navParams.data.room;
    this.user = this.navParams.data.user;
    this.booking = this.navParams.data.booking;
    let date = new Date();
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.todayString = today.getDate() + '/' + today.getMonth() + '/' + today.getFullYear();
    let tomorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    this.tomorrowString = tomorrow.getDate() + '/' + tomorrow.getMonth() + '/' + tomorrow.getFullYear();
    //console.log("room: ", this.room);
    console.log("user: ", this.user);
  }

  openCreditCardModal() {
    let creditCardModal = this.modalCtrl.create(CreditCardModal);
    creditCardModal.onDidDismiss(filters => {
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
        <ion-input type="number" [(ngModel)]="creditCardCCV"></ion-input>
      </ion-item>

      <ion-item>
        <button ion-button (click)="dismiss()">Pay Now</button>
      </ion-item>

    </ion-list>

  </ion-content>
  `
})

export class CreditCardModal {

  creditCardName: string;
  creditCardSurname: string;
  creditCardNumber: string;
  creditCardExpirationDate: string;
  creditCardCCV: string;
  minDate: string = '';
  maxDate: string = '';

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController) {

    let date = new Date();
    let aux = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
    this.minDate = aux.getFullYear() + '-' + aux.getMonth();
    aux = new Date(date.getFullYear() + 10, date.getMonth() + 1, date.getDate());
    this.maxDate = aux.getFullYear() + '-' + aux.getMonth();
    console.log(this.minDate);
    console.log(this.maxDate);

  }


  dismiss() {
    console.log(this.creditCardName);
    console.log(this.creditCardSurname);
    console.log(this.creditCardNumber);
    console.log(this.creditCardExpirationDate);
    console.log(this.creditCardCCV);
    //this.viewCtrl.dismiss();
  }
  cancel() {
    this.viewCtrl.dismiss();
  }
}
