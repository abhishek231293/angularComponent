import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UiSwitchModule } from 'ngx-toggle-switch';

@Component({
  selector: 'app-alerts-and-notifications',
  templateUrl: './alerts-and-notifications.component.html',
  styleUrls: ['./alerts-and-notifications.component.css']
})
export class AlertsAndNotificationsComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 1000)

  }
}
