import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs';
import 'rxjs/add/operator/map'
import * as _ from 'lodash';

@Injectable()

export class DatabaseService {

    constructor(private http: Http) {
    }

    getCities(): Observable<any> {
        return this.http.get('http://francisco.stayplanet.ie/api/getCities')
            .map(res => {
                return res.json();
            });
    }

    getCity(idCity): Observable<any> {
        let url: string = 'http://francisco.stayplanet.ie/api/getCity?id='+idCity;
        return this.http.get(url)
            .map((data) => {
                if (data.status === 200) {
                    return JSON.parse(data["_body"])[0];
                }else {
                    console.log("Something went wrong!");
                }
            });
    }

    getMinMaxPrice(city): Observable<any> {
        let url: string = 'http://francisco.stayplanet.ie/api/getMinMaxPrice?city='+city;
        return this.http.get(url)
            .map((data) => {
                if (data.status === 200) {
                    return JSON.parse(data["_body"])[0];
                }else {
                    console.log("Something went wrong!");
                }
            });
    }

    searchCityProperties(city): Observable<any> {
        let url: string = 'http://francisco.stayplanet.ie/api/searchCityProperties?city='+city;
        return this.http.get(url)
            .map((data) => {
                if (data.status === 200) {
                    return JSON.parse(data["_body"]);
                }else {
                    console.log("Something went wrong!");
                }
            });
    }


}
