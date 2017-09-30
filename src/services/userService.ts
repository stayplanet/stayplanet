import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs';
import 'rxjs/add/operator/map'
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable()

export class UserService {

    api_url: string = 'http://francisco.stayplanet.ie/api';
    constructor(
        private http: Http,
        private nativeStorage: NativeStorage,
        private events: Events,
    ) {
    }

    login(email, password): Observable<any> {
        let url: string = this.api_url + '/appLogin?email=' + email + '&password=' + password;
        return this.http.get(url)
            .map((data) => {
                if (data.status === 200) {
                    let user = JSON.parse(data["_body"]);
                    this.nativeStorage.setItem("user", user).then(() => {
                        this.events.publish('user:changed');
                    });
                    return user;
                } else {
                    console.log("Something went wrong!");
                }
            });
    }

}

