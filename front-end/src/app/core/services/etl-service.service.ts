import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable()
export class EtlServiceService {

  constructor(private httpClient: HttpClient) { 
    console.log('Etl service Loaded');
  }

  startEtl() {
    return this.httpClient.get(`${environment.apiConf.url}/run-etl`).toPromise();
  }

  stopEtl() {
    return this.httpClient.get(`${environment.apiConf.url}/stop-etl`).toPromise();
  }

  getEtlStatus() {
    return this.httpClient.get(`${environment.apiConf.url}/get-etl-status`).toPromise();
  }

  isCompletedEtl() {
    return this.httpClient.get(`${environment.apiConf.url}/iscompleted-etl`).toPromise();
  }

  getCountOfProccededLines() {
    return this.httpClient.get(`${environment.apiConf.url}/count-proceeded-lines-etl`).toPromise();  
  }
}
