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
  telProceedeLines: 0;

  constructor(public _etlServiceService: EtlServiceService) { 
  
  }

  ngOnInit() {
    this.etlRunnerStatus = 'stopped';
    this.isEtlJobRunning = false;
    this.telProceedeLines = 0;
    this.getEtlStatus();
  }

  startPollProccedeLines() {
    setTimeout(() => {
      this._etlServiceService.getCountOfProccededLines()
        .then((data: any) => {
          this.telProceedeLines = data.telProceedeLines;
          if(this.etlRunnerStatus == 'stared') {
            this.startPollProccedeLines();  
          }
        })
    }, 1500);
    
  }//

  setStoppedState() {
    this.etlRunnerStatus = 'stopped';
    this.isEtlJobRunning = false;
  }

  setRunningState() {
    this.etlRunnerStatus = 'stared';
    this.isEtlJobRunning = true;
    this.isCompletedEtl();
    this.startPollProccedeLines();
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
        this.setStoppedState();
      })
      .catch(() => {
        console.log('Changed with Error');
        this.setStoppedState();
      }) 
  }

  startEtlRunner() {
    console.log('Start!');
    this._etlServiceService.startEtl()
      .then(() => {
        console.log('Changed');
        this.setRunningState(); 
      })
      .catch(() => {
        console.log('Changed with Error');
      })
  }

  stopEtlRunner() {
    console.log('Stopr!');
    this._etlServiceService.stopEtl()
      .then(() => {
        console.log('Changed');
        this.setStoppedState();
      })
      .catch(() => {
        console.log('Changed with Error');
        this.setStoppedState();
      })
  }

}
