import { Component, OnInit } from '@angular/core';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-setting-task',
  templateUrl: './setting-task.component.html',
  styleUrls: ['./setting-task.component.css']
})
export class SettingTaskComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 1000)


  }


}
