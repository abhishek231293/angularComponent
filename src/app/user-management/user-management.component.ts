import { Component, OnInit } from '@angular/core';
import { CommonService } from '../_services';
import { Router } from '@angular/router';
import * as $ from 'jquery';
// import {getProjectDetails} from "@angular/cli/utilities/project";
import {environment} from '../../environments/environment';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { UiSwitchModule } from 'ngx-toggle-switch';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  projectRow = [];
  loading = false;
    roles = [];
    departments = [];

  public apiBaseUrl: string = environment.apiBaseUrl;
  constructor(private router: Router,
              private _service: CommonService,private spinner: NgxSpinnerService) { }

    ngOnInit() {

        const token    = localStorage.getItem('userToken');

        const userData = JSON.parse(localStorage.getItem('userData'));

        this.spinner.show();

        let role_param = {
            id: userData.role_id
        };

        this._service.getRoleDetails(role_param,token).subscribe((data: any) => {
            this.roles = data;
            this.spinner.hide();
        });

        // console.log(this.roles);
        let dept_param = ''
        this.spinner.show();
        this._service.getDepartmentDetails(dept_param,token).subscribe((data: any) => {
            this.departments = data;
            this.spinner.hide();
        });


        this.getUserList();
    }

    /*------------------------------Table with Sorting Starts Here------------------------*/

  fields = [
    {
      'field' : 's_no',
      'title' : 'S No.',
      'width' : '5%',
      'code'  : true,
      'sort'  : false
    },
    {
      'field' : 'name',
      'title' : 'Name',
      'width' : '10%',
      'code'  : false,
      'sort'  : true
    },
    {
      'field' : 'email',
      'title' : 'Email',
      'width' : '10%',
      'code'  : false,
      'sort'  : true
    },
    {
      'field' : 'role',
      'title' : 'Role',
      'width' : '10%',
      'code'  : false,
      'sort'  : false
    },
    {
      'field' : 'department',
      'title' : 'Department',
      'width' : '10%',
      'code'  : false,
      'sort'  : false
    },
    {
      'field' : 'is_active',
      'title' : 'Active',
      'width' : '10%',
      'code'  : false,
      'sort'  : true
    },
    {
      'field' : 'created_at',
      'title' : 'Created At',
      'width' : '15%',
      'code'  : false,
      'sort'  : true
    },
    {
      'field' : 'Action',
      'title' : 'Action',
      'width' : '20%',
      'code'  : false,
      'sort'  : false
    }
  ]

    sortType : string = '';
    sortField: string = '';
    oldField: string;
    sortingData= {
        'field' : '',
        'type'  : ''
    };

    sortBy(field, event){

        this.oldField = (this.oldField != field) ? this.oldField : field;


        if(typeof this.oldField !== 'undefined'){
            //console.log(document.getElementById('fa-'+this.oldField));

            document.getElementById('fa-'+this.oldField).classList.remove('fa-sort-up');
            document.getElementById('fa-'+this.oldField).classList.remove('fa-sort-down');
            document.getElementById('fa-'+this.oldField).classList.add('fa-sort');

        }

        event.target.classList.add('fa');

        this.sortField = field;
        this.sortType = (this.sortType == 'desc') ? 'asc' : 'desc';

        switch(this.sortType){
            case 'desc' : {
                event.target.classList.remove('fa-sort-up');
                event.target.classList.add('fa-sort-down');
                this.oldField = field;
            }break;
            case 'asc'  : {
                event.target.classList.remove('fa-sort-down');
                event.target.classList.add('fa-sort-up');
                this.oldField = field;
            }break;
            default     : {
                event.target.classList.add('fa-sort');
            }
        }

        this.sortingData = {
            'field' : this.sortField,
            'type'  : this.sortType
        };

        //console.log(this.sortingData);
        this.getUserList();

    }

    /*------------------------------Table with Sorting Ends Here--------------------------*/

    /*------------------------------Pagination Integration Starts Here------------------------*/
    currentPage: number = 1;
    loader: boolean = false;
    total:number = 0;
    paginate= {
        'last_page' : 1
    };
    route:string;
    searchData: string = '';
    searchRole: string = '';
    searchDepartment: string = '';
    searchFields = { 'name': ''};
    pages: any;
    listData = [];

    previousPage(){
        if(this.currentPage == 1){
            return;
        }

        this.currentPage = this.currentPage -1;
        //console.log(this.currentPage);return;
        this.getUserList();

    }

    nextPage() {

        if (this.paginate.last_page-1 < this.currentPage) {
            return;
        }

        this.currentPage ++;
        // console.log(this.currentPage);
        this.getUserList();
    }

    changePage(){

        this.currentPage = this.currentPage;
        //console.log(this.currentPage);return;
        this.getUserList();

    }

    getPages(n){

        var data = [];

        for (var i = 1; i <= n; i++) {
            data.push(i);
        }
        this.pages = data;
        //console.log(this.pages);
    }

    SearchList(){
        this.currentPage = 1;
        this.searchFields = { 'name': this.searchData};
        this.getUserList();
    }

    refreshList(){
        this.searchData = '';
        this.searchRole = '';
        this.searchDepartment = '';
        this.searchFields = {'name': this.searchData};
        this.getUserList();
    }

    searchDropDown(){
        this.currentPage = 1;
        this.searchFields = {
            'name': this.searchData
        };
        this.getUserList();
    }

    /*------------------------------Pagination Integration Starts Here------------------------*/

    getUserList(){

        this.route  = 'user-list';
        let data = null;
        /*var data = {
         page  : this.currentPage,
         search: this.searchFields,
         sort  : this.sortingData
         };*/

        //console.log(this.route);return;
        const userData = JSON.parse(localStorage.getItem('userData'));

        switch(this.route){

            case 'user-list' :{
                data = {
                    page  : this.currentPage,
                    search: this.searchFields,
                    sort  : this.sortingData,
                    role_id: this.searchRole,
                    department_id : this.searchDepartment
                };
            }
                break;

        }

        // console.log(this.route);
        //console.log(data);

        this.loading = true;
        // this.spinner.show();
        const token    = localStorage.getItem('userToken');
        this.spinner.show();
        // this._service.getRequestCreator(data, this.route, token).subscribe((result: any) => {
        this._service.postRequestCreator(data, this.route, token).subscribe((result: any) => {

            this.loading = false;
            // console.log("hi");
            // console.log(result.paginate.data);
            if(result.status == 204){
                this.router.navigate(['login']);
            }else{
                this.listData = [];
                this.listData = result.paginate.data;
                this.paginate = result.paginate;
                this.total = result.paginate.total;

                this.currentPage = result.paginate.current_page;
                this.getPages(this.paginate.last_page);
            }
            this.spinner.hide();
            // console.log("hi");
            // console.log(this.listData);
        });

    }

    editUser(userId,userEmail){
        swal({
            title: 'Are you sure?',
            text: 'You want to edit user details of '+userEmail,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#30d633',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                localStorage.removeItem("editUserId");
                localStorage.removeItem("editUserEmail");
                localStorage.removeItem("isDisabledUser");
                localStorage.setItem("isDisabledUser", 'false');
                localStorage.setItem("editUserId", userId.toString());
                localStorage.setItem("editUserEmail", userEmail.toString());
                this.router.navigate(['user']);
            }
        });

    }

    viewUser(userId,userEmail){
        localStorage.removeItem("editUserId");
        localStorage.removeItem("editUserEmail");
        localStorage.removeItem("isDisabledBranch");
        localStorage.setItem("isDisabledUser", 'true');
        localStorage.setItem("editUserId", userId.toString());
        localStorage.setItem("editUserEmail", userEmail.toString());

        this.router.navigate(['user']);
    }

    deleteUser(userId,userEmail){
        let data = {
            id: userId,
            email: userEmail
        };
        swal({
            title: 'Are you sure?',
            text: 'You want to delete user details of '+userEmail,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#30d633',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                this.route  = 'delete-user';
                const token    = localStorage.getItem('userToken');
                this.spinner.show();
                this._service.postRequestCreator(data, this.route, token).subscribe((result: any) => {
                    this.loading = false;
                    this.getUserList();
                    this.spinner.hide();
                });
            }
        });
    }


    onKeydown(event) {
        if (event.key === "Enter") {
            this.currentPage = 1;
            this.searchFields = { 'name': this.searchData};
            this.getUserList();
        }
    }

    userIsActive(userId,userEmail,userActiveVal){
        // console.log(userActiveVal);
        var userAction = 'active';
        var isActive = 1;
        if(userActiveVal === true){
            userAction = 'activate';
            isActive = 1;
        }else{
            userAction = 'deactivate';
            isActive = 0;
        }

        let data = {
            id: userId,
            is_active: isActive
        };




        swal({
            title: 'Are you sure?',
            text: 'You want to '+userAction+' user details of '+userEmail,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#30d633',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                this.route  = 'user-activation';
                const token    = localStorage.getItem('userToken');
                this.spinner.show();
                this._service.postRequestCreator(data, this.route, token).subscribe((result: any) => {
                    this.loading = false;
                    this.getUserList();
                    this.spinner.hide();
                });
            }
        });
    }

    addUser(){
        // console.log('add-user');
        this.router.navigate(['add-user']);
    }


}
