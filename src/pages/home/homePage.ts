import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'homePage',
  templateUrl: 'homePage.html'
})

export class HomePage {

  cities: any = [];
  constructor(public navCtrl: NavController, private http: Http) {
  }

  ionViewDidLoad() {
    this.http.get('http://francisco.stayplanet.ie/api/getCities')
      .map(res => res.json())
      .subscribe(data => {
        this.cities = data;
      });
  }

  createCity(name='Telde', country_name='Spain') {
    console.log("name", name);
    console.log("country_name", country_name);
    let body: string = "name=" + name + "&country_name=" + country_name;
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8";
    let headers: any = new Headers({ 'Content-Type': type });
    let options: any = new RequestOptions({ headers: headers });
    let url: string = 'http://francisco.stayplanet.ie/api/createCity';
    
    this.http.post(url, body, options)
      .subscribe((data) => {
        // If the request was successful notify the user
        if (data.status === 200) {
          console.log("Todo crema");
        }
        else {
          console.log("Something went wrong!");
        }
      });
  }

}
