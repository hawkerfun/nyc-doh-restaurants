import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantDbService {

  constructor(private httpClient: HttpClient) { 
    console.log('RestaurantDbService Initialized');
  }

  getThaiRestaurants(searchRestaurantType) {
    console.log(searchRestaurantType);
    return this.httpClient.get(`${environment.apiConf.url}/get-thai-restaurants?type=${searchRestaurantType}`).toPromise();
  }

  getRestaurants() {
    console.log('getRestaurants');
    return this.httpClient.get(`${environment.apiConf.url}/get-restaurants`).toPromise();
  }
}
