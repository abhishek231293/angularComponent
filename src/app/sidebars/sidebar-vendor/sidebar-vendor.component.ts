import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-sidebar-vendor',
  templateUrl: './sidebar-vendor.component.html',
  styleUrls: ['./sidebar-vendor.component.css']
})
export class SidebarVendorComponent implements OnInit {

  msg;
  user_name;
  token;
  auth_user = [];
  is_evaluation_component = false;
  user_role;
  constructor(private activeroute: ActivatedRoute) { }
  API_BASE_URL = environment.apiBaseUrl;
  ngOnInit() {

    this.activeroute.queryParams.subscribe(params => {
      if(params['is_evaluation_form']){
        this.is_evaluation_component = true;
      }
    })

    const userData = JSON.parse(localStorage.getItem('userData'));
    if(userData!=null){
      this.auth_user['role'] = userData['role'];
      if(userData['user_image']==null){
        userData['user_image'] = 'user/XVKTeHXjV1lNdrBtkUwzD36TOX7SoOAf9dByftJn.png';
      }
      this.auth_user['user_image'] = userData['user_image'];
      this.auth_user['role_id'] = userData['role_id'];
      this.user_name     = userData.hasOwnProperty('name') ?  (userData.name) : 'Guest';
      // this.user_name     = userData.hasOwnProperty('first_name') ?  (userData.first_name+' '+userData.last_name) : 'Guest';
      this.user_role = userData['role_id'];
    }

    this.token = localStorage.getItem('userToken');

    const data = [
          [0, 12, "Good Morning"],
          [12, 18, "Good Afternoon"],
          [18, 24, "Good Evening"]
        ],
        hr = new Date().getHours();

    for(var i=0; i<data.length;i++){
      if(hr >= data[i][0] && hr <= data[i][1]){
        this.msg = data[i][2];
        break;
      }
    }
  }

}
