import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantDbService {

  setRestaurantsData: Function;

  constructor(private httpClient: HttpClient) {
    console.log('RestaurantDbService Initialized as SingleTon');
  }

  setRestaurantsHolder(cb) {
    this.setRestaurantsData = cb;
  }

  getRestaurants(searchRestaurantType, pageIndex, orderBy) {
    return this.httpClient.get(`${environment.apiConf.url}/get-restaurants?type=${searchRestaurantType}&pageIndex=${pageIndex}&orderBy=${orderBy}`).toPromise();
  }

  getRestaurantsLongPoll() {
    this.httpClient.get(`${environment.apiConf.url}/get-restaurants-longpoll`).toPromise()
    .then((data:any) => {
      this.setRestaurantsData(data.restaurants);
    })  
  }

  trunkateRestaurants() {
    this.httpClient.get(`${environment.apiConf.url}/trunkate-tables`).toPromise()
    .then(() => {
      return this.getRestaurants('',0,'SCORE');
    })
    .then((data:any) => {
      this.setRestaurantsData(data.restaurants);
    })
    .catch(err => {
      console.log(err);
    }) 
  }
}
