import { Injectable } from '@angular/core';
import { Events, Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { Stripe } from '@ionic-native/stripe';
import 'rxjs';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';
import { RequestOptionsArgs } from '@angular/http/src/interfaces';

@Injectable()

export class UserService {

    api_url: string = 'http://www.stayplanet.net/api/appapi/';
    appKey = 'StayPlanet';
    constructor(
        private http: Http,
        private nativeStorage: NativeStorage,
        private events: Events,
        private platform: Platform,
        private transfer: Transfer,
        private stripe: Stripe,
    ) {
    }

    login(email, password): Observable<any> {
        let url: string = this.api_url + 'appLogin?appKey=' + this.appKey + '&email=' + email + '&password=' + password;
        return this.http.get(url)
            .map(data => {
                if (data.status === 200) {
                    let user = data["_body"];
                    if (user == "") {
                        return false;
                    } else if (this.platform.is('cordova')) {
                        this.nativeStorage.setItem("user", JSON.parse(user)).then(() => {
                            this.events.publish('user:changed');
                        });
                        return JSON.parse(user);
                    } else {
                        this.events.publish('user:changed', JSON.parse(user));
                        return JSON.parse(user);
                    }
                } else {
                    console.log("Something went wrong!");
                }
            });
    }

    compareEmail(email): Observable<boolean> {
        let url: string = this.api_url + 'compareEmail?appKey=' + this.appKey + '&email=' + email;
        return this.http.get(url)
            .map(res => {
                if (res["_body"] != "") {
                    return false;
                } else {
                    return true;
                }
            });
    }

    signup(name, surname, gender, phoneNumber, email, password, membershipType, country, postCode, address, informAboutLatestNews): Observable<any> {
        let url: string = this.api_url + 'appSignUp?appKey=' + this.appKey + '&name=' + name + '&surname=' + surname + '&gender=' + gender + '&phoneNumber=' + phoneNumber + '&email=' + email + '&password=' + password
            + '&membershipType=' + membershipType + '&country=' + country + '&postCode=' + postCode + '&address=' + address + '&informAboutLatestNews=' + informAboutLatestNews;
        console.log(url);
        return this.http.get(url)
            .map((data) => {
                if (data.status === 200) {
                    return true;
                } else {
                    console.log("Something went wrong!");
                    return false;
                }
            });
    }

    uploadUserInfo(name, surname, email, country, city, mobilePhone) {
        let url: string = this.api_url + 'uploadUserInfo?appKey=' + this.appKey + '&name=' + name +
            '&surname=' + surname + '&email=' + email + '&country=' + country + '&mobilePhone=' + mobilePhone + '&city=' + city;
        return this.http.get(url)
            .map(res => {
                console.log(res);
                if (res["_body"] != "" || res["_body"] != "Something went wrong") {
                    return true;
                } else {
                    return false;
                }
            });
    }

    uploadImage(fullImagePath, options, userEmail): Promise<boolean> {
        const fileTransfer: TransferObject = this.transfer.create();
        let url: string = this.api_url + 'uploadImage?appKey=' + this.appKey + '&email=' + userEmail;
        console.log('url1: ', url);
        return fileTransfer.upload(fullImagePath, url, options).then(data => {
            console.log('data1: ', data);
            let url: string = this.api_url + 'updateUserImage?appKey=' + this.appKey + '&imageName=' + options.fileName + '&userEmail=' + userEmail;
            console.log('url2: ', url);
            this.http.get(url).subscribe(data => {
                console.log('data2: ', data);
            });
            return true;
        }, error => {
            console.log("error: ", error);
            return false;
        });

    }

    getNewsLetter(email) {
        let url: string = this.api_url + 'getNewsLetter?appKey=' + this.appKey + '&email=' + email;
        return this.http.get(url)
            .map(res => {
                if (res["_body"] != "") {
                    return JSON.parse(res["_body"]);
                } else {
                    return [];
                }
            });
    }
    setNewsletter(email, value) {
        let url: string = this.api_url + 'setNewsletter?appKey=' + this.appKey + '&email=' + email + '&value=' + value;
        return this.http.get(url)
            .map(res => {
                if (res["_body"] != "") {
                    return true;
                } else {
                    return false;
                }
            });
    }

    createCardToken(creditCardDetails, price, booking_id, bookinf_ref_no, firstname, lastname): Promise<any> {
        return this.stripe.setPublishableKey('pk_test_wbCl3saZ8EX90oYDY3U6oipz').then(success => {
            return this.stripe.createCardToken(creditCardDetails)
                .then(token => {
                    token.card['number'] = creditCardDetails.number;
                    token.card['cvv'] = creditCardDetails.cvc;
                    var data = 'stripeToken=' + JSON.stringify(token) + '&price=' + price + '&booking_id=' + booking_id + '&bookinf_ref_no=' + bookinf_ref_no
                    + '&firstname=' + firstname + '&lastname=' + lastname;
                    var headers = new Headers();
                    headers.append('Content-Type', 'application/x-www-form-urlencoded');
                    var options: RequestOptionsArgs = { 'headers': headers };
                    return this.http.post(this.api_url + 'payInvoice?appKey=' + this.appKey, data, options).subscribe(res => {
                        if(res['_body'] == 'true'){
                            return true;
                        }else{
                            return false;
                        }
                    });
                })
                .catch(error => {
                    console.log('error: ', error);
                });
        });
    }

    getWishlist(wish_user, wish_itemid): Observable<boolean> {
        let url: string = this.api_url + 'getWishlist?appKey=' + this.appKey + '&wish_user=' + wish_user + '&wish_itemid=' + wish_itemid;
        return this.http.get(url)
            .map(res => {
                if (res["_body"] == "") {
                    return false;
                } else {
                    return true;
                }
            });
    }

    addToWhishlist(wish_user, wish_itemid, wish_module): Observable<boolean> {
        let url: string = this.api_url + 'addToWhishlist?appKey=' + this.appKey + '&wish_user=' + wish_user + '&wish_itemid=' + wish_itemid + '&wish_module=' + wish_module;
        return this.http.get(url)
            .map(res => {
                if (res["_body"] == "") {
                    return false;
                } else {
                    return true;
                }
            });
    }

    removeFromWhishlist(wish_user, wish_itemid): Observable<boolean> {
        let url: string = this.api_url + 'removeFromWhishlist?appKey=' + this.appKey + '&wish_user=' + wish_user + '&wish_itemid=' + wish_itemid;
        return this.http.get(url)
            .map(res => {
                if (res["_body"] == "") {
                    return false;
                } else {
                    return true;
                }
            });
    }

}
