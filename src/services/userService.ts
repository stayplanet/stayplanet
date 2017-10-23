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

    api_url: string = 'http://francisco.stayplanet.ie/api';
    constructor(
        private http: Http,
        private nativeStorage: NativeStorage,
        private events: Events,
        private platform: Platform,
        private transfer: Transfer,
    ) {
    }

    login(email, password): Observable<any> {
        let url: string = this.api_url + '/appLogin?email=' + email + '&password=' + password;
        return this.http.get(url)
            .map(data => {
                if (data.status === 200) {
                    let user = JSON.parse(data["_body"]);
                    if (!user) {
                        return false;
                    } else if (this.platform.is('cordova')) {
                        this.nativeStorage.setItem("user", user).then(() => {
                            this.events.publish('user:changed');
                        });
                        return user;
                    } else {
                        this.events.publish('user:changed', user);
                        return user;
                    }
                } else {
                    console.log("Something went wrong!");
                }
            });
    }

    compareEmail(email): Observable<boolean> {
        let url: string = this.api_url + '/compareEmail?email=' + email;
        return this.http.get(url)
            .map(res => {
                if (res.json().length > 0) {
                    return true;
                } else {
                    return false;
                }
            });
    }

    signup(name, surname, gender, email, password, membershipType, country, region, city, postCode, address, informAboutLatestNews): Observable<any> {
        let url: string = this.api_url + '/appSignUp?name=' + name + '&surname=' + surname + '&gender=' + gender + '&email=' + email + '&password=' + password
            + '&membershipType=' + membershipType + '&country=' + country + '&region=' + region + '&city=' + city
            + '&postCode=' + postCode + '&address=' + address + '&informAboutLatestNews=' + informAboutLatestNews;
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

