import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import {CommonService} from '../_services';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import { FormBuilder, FormControl ,FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-projects-summary',
  templateUrl: './projects-summary.component.html',
  styleUrls: ['./projects-summary.component.css']
})
export class ProjectsSummaryComponent implements OnInit {

  lat: number = 23.8859;
  lng: number = 45.0792;
  zoom = 5;
  analyticsData = [];
  taskCompletionPercentage = '';
  markers = [];

  markerStatus = true;

  chatDataForm:FormGroup;

  API_BASE_URL = environment.apiBaseUrl;

  public result;
  route: string;

  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private _service: CommonService,
      private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.getAnalyticsData();
  }

  getAnalyticsData(){
    const userData = JSON.parse(localStorage.getItem('userData'));
    const token    = localStorage.getItem('userToken');

    this.route  = 'activity-details';
    var data = {
      'role_id' : userData['role_id']
    };

    this._service.postRequestCreator(data, this.route, token).subscribe((response: any) => {
      if(response['response'] == 200){
        this.analyticsData = response['result'];
        if(this.analyticsData['completedTask']){
          this.taskCompletionPercentage = ((this.analyticsData['completedTask']/this.analyticsData['totalTasks'])*100).toFixed(0);
        }
        var marker = [];
        var icon = '';
        this.analyticsData['mapData'].forEach(function (value) {
          if(value.deadline && (new Date(value.deadline) < new Date())){
            icon = '/../../assets/img/overdue.png';
          }else{
            icon = (value.project_status) ? '/../../assets/img/'+value.project_status+'.png' : '/../../assets/img/inprogress.png';
          }
          let obj = {
            'lat' : parseFloat(value.latitude),
            'lang': parseFloat(value.longitude),
            'icon' : icon,
            'deadline' : value.deadline
          }
          marker.push(obj);
        });

        this.markers = marker;
        console.log(this.markers);
      }
    });
  }
}
