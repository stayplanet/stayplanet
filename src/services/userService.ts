import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs';
import 'rxjs/add/operator/map'
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable()

export class UserService {

    constructor(
        private http: Http,
        private nativeStorage: NativeStorage
    ) {
    }

    login(email, password): Observable<any> {
        console.log(email);
        console.log(password);
        let url: string = 'http://francisco.stayplanet.ie/api/appLogin?email=' + email + '&password=' + password;
        return this.http.get(url)
            .map((data) => {
                if (data.status === 200) {
                    let user = JSON.parse(data["_body"]);
                    this.nativeStorage.setItem("user", user);
                    return user;
                } else {
                    console.log("Something went wrong!");
                }
            });
    }

}

