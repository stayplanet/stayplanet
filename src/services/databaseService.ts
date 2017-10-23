import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs';
import 'rxjs/add/operator/map'

@Injectable()

export class DatabaseService {

    api_url: string = 'http://francisco.stayplanet.ie/api';
    propertyFeatures: any = {
        "roomTypes": [
            { "key": "privateRoom", "name": "Private Room", "value": false },
            { "key": "commonRoom", "name": "Coomon Room", "value": false },
            { "key": "sharedRoom", "name": "Shared Room", "value": false }
        ],
        "propertyTypes": [
            { "key": "farmStay", "name": "Farmstay", "value": false },
            { "key": "camping", "name": "Camping", "value": false },
            { "key": "villageStay", "name": "Village Stay", "value": false },
            { "key": "studentAccommodation", "name": "Student Accommodation", "value": false },
            { "key": "chalet", "name": "Chalet", "value": false },
            { "key": "castle", "name": "Castle", "value": false },
            { "key": "aparthotel", "name": "Aparthotel", "value": false },
            { "key": "boat", "name": "Boat", "value": false },
            { "key": "cottage", "name": "Cottage", "value": false },
            { "key": "house", "name": "House", "value": false },
            { "key": "homestay", "name": "Homestay", "value": false },
            { "key": "guestHouse", "name": "Guest House", "value": false },
            { "key": "villa", "name": "Villa", "value": false },
            { "key": "hotel", "name": "Hotel", "value": false },
            { "key": "hostel", "name": "Hostel", "value": false },
            { "key": "selfCatering", "name": "Self Catering", "value": false },
            { "key": "resort", "name": "Resort", "value": false },
            { "key": "apartment", "name": "Apartment", "value": false },
            { "key": "bedAndBreakfast", "name": "Bed and Breakfast", "value": false }
        ],
        "amenities": [
            { "key": "wirelessInternet", "name": "FarmStay", "value": false },
            { "key": "kitchen", "name": "Kitchen", "value": false },
            { "key": "Esse", "name": "Essentials", "value": false },
            { "key": "cableTV", "name": "Cable TV", "value": false },
            { "key": "heating", "name": "Heating", "value": false },
            { "key": "internet", "name": "Internet", "value": false },
            { "key": "washer", "name": "Washer", "value": false },
            { "key": "dryer", "name": "Dryer", "value": false },
            { "key": "breakfast", "name": "Breakfast", "value": false },
            { "key": "family/kidFriendly", "name": "Family/Kid Friendly", "value": false },
            { "key": "suitableForEvents", "name": "Suitable for Events", "value": false },
            { "key": "wheelchairAccessible", "name": "Wheelchair Accessible", "value": false },
            { "key": "elevatorInBuilding", "name": "Elevator in Buildind", "value": false },
            { "key": "indoorFireplace", "name": "Indoor Fireplace", "value": false },
            { "key": "buzzer/wirelessIntercom", "name": "Buzzer/Wireless Intercom", "value": false },
            { "key": "doorman", "name": "Doorman", "value": false },
            { "key": "pool", "name": "Pool", "value": false },
            { "key": "hotTub", "name": "Hot Tub", "value": false },
            { "key": "gym", "name": "Gym", "value": false },
            { "key": "smokeDetector", "name": "Smoke Detector", "value": false },
            { "key": "outdoorShower", "name": "Outdoor Shower", "value": false },
            { "key": "ice", "name": "Ice", "value": false },
            { "key": "tableTennis", "name": "Table Tennis", "value": false },
            { "key": "carAvailable", "name": "Car Available", "value": false },
            { "key": "chefAvailable", "name": "Chef Available", "value": false },
            { "key": "lineProvider", "name": "Line Provided", "value": false },
            { "key": "towelsProvided", "name": "Towels Provided", "value": false },
            { "key": "hairDryer", "name": "Hair Dryer", "value": false },
            { "key": "businessCenter", "name": "Business Center", "value": false }
        ],
        "extras": [
            { "key": "airConditioning", "name": "Air Conditioning", "value": false },
            { "key": "freeParkingOnPremises", "name": "Free Parking on Premises", "value": false },
            { "key": "shampoo", "name": "Shampoo", "value": false }
        ],
        "specialFeatures": [
            { "key": "petsAllowed", "name": "Pets Allowed", "value": false },
            { "key": "smokingAllowed", "name": "Smoking Allowed", "value": false }
        ]

    }

    constructor(private http: Http) {
    }

    getCountries() {
        let url: string = this.api_url + '/getCountries';
        return this.http.get(url)
            .map(res => {
                return res.json();
            });
    }

    getCities(): Observable<any> {
        return this.http.get('http://francisco.stayplanet.ie/api/getCities')
            .map(res => {
                return res.json();
            });
    }

    getCity(idCity): Observable<any> {
        let url: string = this.api_url + '/getCity?id=' + idCity;
        return this.http.get(url)
            .map(data => {
                if (data.status === 200) {
                    return JSON.parse(data["_body"])[0];
                } else {
                    console.log("Something went wrong!");
                }
            });
    }

    getMinMaxPrice(city): Observable<any> {
        let url: string = 'http://francisco.stayplanet.ie/api/getMinMaxPrice?city=' + city;
        return this.http.get(url)
            .map(data => {
                if (data.status === 200) {
                    return JSON.parse(data["_body"])[0];
                } else {
                    console.log("Something went wrong!");
                }
            });
    }

    searchCityProperties(city, filters, guests): Observable<any> {
        //let checkInDate = filters.checkInDate;
        //let checkOutDate = filters.checkOutDate;
        //let url: string = 'http://francisco.stayplanet.ie/api/searchCityProperties?city=' + city + '&checkInDate=' + checkInDate + '&checkOutDate=' + checkOutDate + '&guest=' + guests;
        let url: string = 'http://francisco.stayplanet.ie/api/searchCityProperties?city=' + city + '&guests=' + guests;
        return this.http.get(url)
            .map(data => {
                if (data.status === 200) {
                    return JSON.parse(data["_body"]);
                } else {
                    console.log("Something went wrong!");
                }
            });
    }

    getPropertyFeatures() {
        return this.propertyFeatures;
    }

    getCountryRegions(country_id) {
        let url: string = this.api_url + '/getCountryRegions?country_id=' + country_id;
        return this.http.get(url)
            .map(res => {
                return res.json();
            });
    }

    compareCityName(name, region_id) {
        let url: string = this.api_url + '/compareCityName?name=' + name + '&region_id=' + region_id;
        return this.http.get(url)
            .map(res => {
                if (res.json().length > 0){
                    return ({
                        "exist": true,
                        "city": res.json()[0]
                    });
                } else {
                    return ({
                        "exist": false,
                        "city": "No city"
                    });
                }
            });
    }

    getReviews(product_id){
        let url: string = this.api_url + '/getReviews?product_id=' + product_id;
        return this.http.get(url)
            .map(data => {
                if (data.status === 200) {
                    return data.json();
                } else {
                    console.log("Something went wrong!");
                }
            });
    }

    getSeller(id): Observable<any> {
        let url: string = this.api_url + '/getSeller?id=' + id;
        return this.http.get(url)
            .map(data => {
                if (data.status === 200) {
                    return JSON.parse(data["_body"])[0];
                } else {
                    console.log("Something went wrong!");
                }
            });
    }


}
