import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, 
  MatToolbarModule,
  MatTableModule,
  MatProgressSpinnerModule
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
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
