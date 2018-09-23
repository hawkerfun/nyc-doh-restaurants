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

  getRestaurants(searchRestaurantType, pageIndex, orderBy) {
    console.log('getRestaurants');
    return this.httpClient.get(`${environment.apiConf.url}/get-restaurants?type=${searchRestaurantType}&pageIndex=${pageIndex}&orderBy=${orderBy}`).toPromise();
  }
}
