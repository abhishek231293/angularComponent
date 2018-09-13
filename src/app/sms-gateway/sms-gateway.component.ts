import { Component, OnInit } from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-sms-gateway',
  templateUrl: './sms-gateway.component.html',
  styleUrls: ['./sms-gateway.component.css']
})
export class SmsGatewayComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    setTimeout(()=>{
      this.spinner.hide();
    }, 1000);
  }

}
