import { Component, OnInit } from '@angular/core';
import {RestaurantDbService} from '../core/services/restaurant-db.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-table-search',
  templateUrl: './table-search.component.html',
  styleUrls: ['./table-search.component.css'],
  providers:[RestaurantDbService]
})
export class TableSearchComponent implements OnInit {

  displayedColumns: string[] = ['DBA', 'GRADE', 'SCORE', 'BUILDING', 'STREET', 'BORO', 'ZIPCODE', 'PHONE', 'GRADE_DATE'];
  dataSource = [];
  searchRestaurantType: String;

  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  
  constructor(private _RestaurantDbService: RestaurantDbService) { }

  ngOnInit() {
  
  this.getRestaurants(0);
  }

  setNewDataSource () {
    /*{
      DBA: "LE VIET CAFE",
      BUILDING: "1750",
      STREET: "2ND AVE",
      BORO: "MANHATTAN",
      ZIPCODE: "10128",
      PHONE: "9173883897",
      GRADE: "B",
      SCORE: 27,
      GRADE_DATE: "07/12/2017"
    },*/
  }

  pullNewDataBatch($event) {
    const pageIndex = $event.pageIndex;
    const pageSize = $event.pageSize;
    this.getRestaurants(pageIndex*pageSize);
  }

  getThaiRestaurants() {
    console.log('Get Thai Restaurants');
    console.log(this.searchRestaurantType);
    this._RestaurantDbService.getThaiRestaurants(this.searchRestaurantType)
      .then((data: any) => {
        console.log(data);
        this.dataSource = data.restaurants;
      })
      .catch(err => {

      })
  }

  getRestaurants(pageIndex) {
    console.log('Get Restaurants');
    this._RestaurantDbService.getRestaurants(pageIndex)
      .then((data: any) => {
        console.log(data);
        this.dataSource = data.restaurants;
      })
      .catch(err => {

      })
  }

}
