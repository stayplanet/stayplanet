import { Injectable } from '@angular/core';
import { Events, Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import 'rxjs';
import 'rxjs/add/operator/map'
import * as _ from 'lodash';

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
    ) {
    }

    login(email, password): Observable<any> {
        let url: string = this.api_url + 'appLogin?appKey=' + this.appKey + '&email=' + email + '&password=' + password;
        return this.http.get(url)
            .map(data => {
                console.log("data: ", data);
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

    uploadImage(fullImagePath, uploadUrl, options, userEmail): Promise<boolean> {
        const fileTransfer: TransferObject = this.transfer.create();
        uploadUrl += userEmail;
        return fileTransfer.upload(fullImagePath, uploadUrl, options).then(data => {
            let url: string = this.api_url + '/updateUserImage?imageName=' + options.fileName + '&userEmail=' + userEmail;
            this.http.get(url).subscribe(data => {
            });
            return true;
        }, error => {
            console.log("error: ", error);
            return false;
        });

    }
}

