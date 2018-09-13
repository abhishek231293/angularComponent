import { Component, OnInit } from '@angular/core';
// import { CommonService } from '../_services/common.service';
// import {HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import {environment} from '../../environments/environment';
import {DateObject} from 'ngx-bootstrap/chronos/types';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    user_name ='';
    user_image = '';
    user_created_at: DateObject;
  constructor(private router: Router) { }
API_BASE_URL = environment.apiBaseUrl;


  ngOnInit() {

     const token    = localStorage.getItem('userToken');
      if(!token){
          this.router.navigate(['login']);
          return;
      }else{
          const userData = JSON.parse(localStorage.getItem('userData'));
          console.log(userData);
          // this.user_name     = userData.hasOwnProperty('first_name') ?  (userData.first_name+' '+userData.last_name) : 'Guest';
          this.user_name     = userData.hasOwnProperty('name') ?  (userData.name) : 'Guest';
          this.user_image = userData['user_image'];
          if(this.user_image==null){
              this.user_image = 'user/XVKTeHXjV1lNdrBtkUwzD36TOX7SoOAf9dByftJn.png';
          }
          this.user_created_at = userData['created_at'].date;
          // var objDate = new Date("10/11/2009"),
      }
  }

    logout() {
        swal({
            title: 'Are you sure?',
            text: 'You want to logout!',            type: 'warning',

            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                localStorage.removeItem('userToken');
                localStorage.removeItem('userData');
                this.router.navigate(['login']);
                location.reload();
            }
        });
        // this.router.navigate(['login']);
    }

}
