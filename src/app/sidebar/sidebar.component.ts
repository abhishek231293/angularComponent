import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

    is_evaluation_component = false;
    msg;
    user_name;
    token;
    auth_user = [];
    user_role;
  constructor(private router: Router) { }
    API_BASE_URL = environment.apiBaseUrl;
  ngOnInit() {
      
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

    openEvaluationForm(){
        this.router.navigate(['evaluation'],{ queryParams: { project_id: 1000,vendor_id: 1000,search_evl_id:1000,is_evaluation_form:true }});
    }

    openGis(){
        window.open(environment.gisUrl);
    }

}
