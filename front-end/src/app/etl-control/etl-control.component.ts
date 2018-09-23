import { Component, OnInit } from '@angular/core';
import {EtlServiceService} from '../core/services/etl-service.service';

@Component({
  selector: 'app-etl-control',
  templateUrl: './etl-control.component.html',
  styleUrls: ['./etl-control.component.css'],
  providers:[EtlServiceService]
})
export class EtlControlComponent implements OnInit {

  etlRunnerStatus: String;
  isEtlJobRunning: Boolean;

  constructor(public _etlServiceService: EtlServiceService) { 
  
  }

  ngOnInit() {
    this.etlRunnerStatus = 'stopped';
    this.isEtlJobRunning = false;
    this.getEtlStatus();
  }

  logMessage() {
    console.log('Hi');
  }//

  setStoppedState() {
    this.etlRunnerStatus = 'stopped';
    this.isEtlJobRunning = false;
  }

  setRunningState() {
    this.etlRunnerStatus = 'stared';
    this.isEtlJobRunning = true;
    this.isCompletedEtl();
  }

  getEtlStatus() {
    this._etlServiceService.getEtlStatus()
      .then((data: any) => {
        if(data.etlStatus == "stopped") {
          this.setStoppedState() 
        }

        if(data.etlStatus == "running") {
          console.log('Running');
          this.setRunningState(); 
        }
      })
      .catch((err) => {
        console.log(err);
      }) 
  }

  isCompletedEtl() {
    this._etlServiceService.isCompletedEtl()
      .then(() => {
        console.log('Changed');
        this.etlRunnerStatus = 'stopped';
        this.isEtlJobRunning = false;
      })
      .catch(() => {
        console.log('Changed with Error');
        this.etlRunnerStatus = 'stopped';
        this.isEtlJobRunning = false;
      }) 
  }

  startEtlRunner() {
    console.log('Start!');
    this._etlServiceService.startEtl()
      .then(() => {
        console.log('Changed');
        this.etlRunnerStatus = 'stared';
        this.isEtlJobRunning = true;
        this.isCompletedEtl();
      })
      .catch(() => {
        console.log('Changed with Error');
        this.etlRunnerStatus = 'stared';
        this.isEtlJobRunning = true;
        this.isCompletedEtl();
      })
  }

  stopEtlRunner() {
    console.log('Stopr!');
    this._etlServiceService.stopEtl()
      .then(() => {
        console.log('Changed');
        this.etlRunnerStatus = 'stopped';
        this.isEtlJobRunning = false;
      })
      .catch(() => {
        console.log('Changed with Error');
        this.etlRunnerStatus = 'stopped';
        this.isEtlJobRunning = false;
      })
  }

}
