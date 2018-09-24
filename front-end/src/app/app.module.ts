import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {RestaurantDbService} from './core/services/restaurant-db.service';
import {EtlServiceService} from './core/services/etl-service.service';

import {
  MatButtonModule, 
  MatToolbarModule,
  MatTableModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatPaginatorModule,
  MatSelectModule
} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import 'hammerjs';

import { AppComponent } from './app.component';
import { TableSearchComponent } from './table-search/table-search.component';
import { EtlControlComponent } from './etl-control/etl-control.component';

@NgModule({
  declarations: [
    AppComponent,
    TableSearchComponent,
    EtlControlComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatInputModule,
    FormsModule,
    MatPaginatorModule,
    MatSelectModule
  ],
  providers: [
    HttpClient,
    EtlServiceService, 
    RestaurantDbService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
