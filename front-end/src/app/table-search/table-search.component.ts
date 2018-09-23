import { Component, OnInit, ViewChild } from '@angular/core';
import {RestaurantDbService} from '../core/services/restaurant-db.service';
import {MatPaginator} from '@angular/material';

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
  searchRestaurantType = '';
  orderBy = 'SCORE';
  @ViewChild(MatPaginator) paginator: MatPaginator

  length = 100;
  pageSize = 20;
  pageSizeOptions: number[] = [5, 10, 20, 100];
  
  constructor(private _RestaurantDbService: RestaurantDbService) { }

  ngOnInit() {
  
    this.getRestaurants(0);

  }

  pullNewDataBatch($event) {
    const pageIndex = $event.pageIndex;
    const pageSize = $event.pageSize;
    this.getRestaurants(pageIndex*pageSize);
  }

  executeSearch() {
    this.paginator.pageIndex = 0; 
    this.getRestaurants(0)
  }

  getRestaurants(pageIndex) {
    console.log('Get Restaurants');
    this._RestaurantDbService.getRestaurants(this.searchRestaurantType, pageIndex, this.orderBy)
      .then((data: any) => {
        console.log(data);
        this.dataSource = data.restaurants;
      })
      .catch(err => {

      })
  }

}
