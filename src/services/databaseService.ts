import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs';
import 'rxjs/add/operator/map'
import * as _ from 'lodash';

@Injectable()

export class DatabaseService {

/*
    propertyFeatures: any = {
        "roomTypes": [
            { "key": "privateRoom", "name": "Private Room", "value": false },
            { "key": "commonRoom", "name": "Coomon Room", "value": false },
            { "key": "sharedRoom", "name": "Shared Room", "value": false }
        ],
        "propertyTypes": [
            { "key": "farmStay", "name": "Farm Stay", "value": false },
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
            {"key": "outdoorShower", "name": "Outdoor Shower", "value": false },
            { "key": "ice", "name": "Ice", "value": false },
            { "key": "tableTennis", "name": "Table Tennis", "value": false },
            { "key": "carAvailable", "name": "Car Available", "value": false },
            { "key": "chefAvailable", "name": "Chef Available", "value": false },
            {"key": "lineProvider", "name": "Line Provided", "value": false },
            { "key": "towelsProvided", "name": "Towels Provided", "value": false },
            { "key": "hairDryer", "name": "Hair Dryer", "value": false },
            { "key": "", "name": "Business Center", "value": false }
        ],
        "extras": [
            { "key": "airConditioning", "name": "Air Conditioning", "value": false },
            { "key": "freeParkingOnPremises", "name": "Free Parking on Premises", "value": false },
            { "key": "shampoo", "name": "Shampooo", "value": false }
        ],
        "specialFeatures": [
            { "key": "petsAllowed", "name": "Pets Allowed", "value": false },
            { "key": "smokingAlloed", "name": "Smoking Allowed", "value": false }
        ]
    }
*/
propertyFeatures: any = {
    "roomTypes": [
        { "key": "privateRoom", "name": "Private Room", "value": false },
        { "key": "commonRoom", "name": "Coomon Room", "value": false },
        { "key": "sharedRoom", "name": "Shared Room", "value": false }
    ],
    "propertyTypes": [
        { "key": "farmStay", "name": "Farm Stay", "value": false },
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
        {"key": "outdoorShower", "name": "Outdoor Shower", "value": false },
        { "key": "ice", "name": "Ice", "value": false },
        { "key": "tableTennis", "name": "Table Tennis", "value": false },
        { "key": "carAvailable", "name": "Car Available", "value": false },
        { "key": "chefAvailable", "name": "Chef Available", "value": false },
        {"key": "lineProvider", "name": "Line Provided", "value": false },
        { "key": "towelsProvided", "name": "Towels Provided", "value": false },
        { "key": "hairDryer", "name": "Hair Dryer", "value": false },
        { "key": "businessCenter", "name": "Business Center", "value": false }
    ],
    "extras": [
        { "key": "airConditioning", "name": "Air Conditioning", "value": false },
        { "key": "freeParkingOnPremises", "name": "Free Parking on Premises", "value": false },
        { "key": "shampoo", "name": "Shampooo", "value": false }
    ],
    "specialFeatures": [
        { "key": "petsAllowed", "name": "Pets Allowed", "value": false },
        { "key": "smokingAllowed", "name": "Smoking Allowed", "value": false }
    ]

}

    constructor(private http: Http) {
    }

    getCities(): Observable<any> {
        return this.http.get('http://francisco.stayplanet.ie/api/getCities')
            .map(res => {
                return res.json();
            });
    }

    getCity(idCity): Observable<any> {
        let url: string = 'http://francisco.stayplanet.ie/api/getCity?id=' + idCity;
        return this.http.get(url)
            .map((data) => {
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
            .map((data) => {
                if (data.status === 200) {
                    return JSON.parse(data["_body"])[0];
                } else {
                    console.log("Something went wrong!");
                }
            });
    }

    searchCityProperties(city): Observable<any> {
        let url: string = 'http://francisco.stayplanet.ie/api/searchCityProperties?city=' + city;
        return this.http.get(url)
            .map((data) => {
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


}
