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
  selector: 'app-vendor-management',
  templateUrl: './vendor-management.component.html',
  styleUrls: ['./vendor-management.component.css']
})
export class VendorManagementComponent implements OnInit {
  projectRow = [];
  loading = false;
  roles = [];
  departments = [];
  types = [];
  addVendor = false;
  newVendorType = '';
  /*imgsr = '../../assets/img/p5.png';
   imgCaption = 'Men';
   read = true;
   isActive = [];
   projects = [];
   auth_user = [];
   projectDet = [{
   'branch_code':'',
   'cost_center':'',
   'budget_cap':'',
   'action':'',
   'reason':'',
   }];
   total;
   imageSet = [{}];
   updateEnable:boolean = false;
   newProjectObject = {};
   projectAction = {};
   route:string;
   siteProfileErrorMessage = '';
   staffInfoErrorMessage   = '';*/
  /*paginate= {
   'last_page' : 1
   };
   pages: any;
   currentPage: number = 1;
   searchData: string = '';
   searchFields = { 'name': '' };
   blinkid;*/
  public apiBaseUrl: string = environment.apiBaseUrl;
  constructor(private router: Router,
              private _service: CommonService,private spinner: NgxSpinnerService) { }

  ngOnInit() {

    const userData = JSON.parse(localStorage.getItem('userData'));

    this.getTypeList();

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
      'field' : 'type_name',
      'title' : 'Type',
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
  searchType: string = '';
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

    this.searchType = '';
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

    this.route  = 'vendor-list';
    let data = null;
    /*var data = {
     page  : this.currentPage,
     search: this.searchFields,
     sort  : this.sortingData
     };*/

    //console.log(this.route);return;
    const userData = JSON.parse(localStorage.getItem('userData'));

    switch(this.route){

      case 'vendor-list' :{
        data = {
          page  : this.currentPage,
          search: this.searchFields,
          sort  : this.sortingData,
          type_id: this.searchType,
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

  getTypeList(){

    this.route  = 'vendor-type';
    const token    = localStorage.getItem('userToken');
    this._service.postRequestCreator({}, this.route, token).subscribe((result: any) => {
      this.types = result;
    });

  }

  addVendorType(){
    this.addVendor = true;
  }

  submitVendorType(){

    if(this.newVendorType && this.newVendorType != '' && this.newVendorType != null){
      this.route  = 'add-vendor-type';
      const token    = localStorage.getItem('userToken');
      this.spinner.show();
      this._service.postRequestCreator({'vendor_type':this.newVendorType}, this.route, token).subscribe((result: any) => {

        if(result['status']){
          this.getTypeList();
          this.addVendor = false;
          swal("Success", 'Vendor type added successfully', 'success');
        }else{
          swal("Error..!", 'Something went wrong please try again', 'warning');
        }
        this.spinner.hide();
        this.newVendorType = '';

      });
    }else{
      swal("Error..!", 'Please enter vendor type', 'warning');
      return ;
    }

  }

  editUser(userId,userEmail){
    swal({
      title: 'Are you sure?',
      text: 'You want to edit vendor details of '+userEmail,
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
        this.router.navigate(['vendor-panel']);
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

    this.router.navigate(['vendor-panel']);
  }

  deleteUser(userId,userEmail){
    let data = {
      id: userId,
      email: userEmail
    };
    swal({
      title: 'Are you sure?',
      text: 'You want to delete vendor details of '+userEmail,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#30d633',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.route  = 'delete-vendor';
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
      text: 'You want to '+userAction+' vendor details of '+userEmail,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#30d633',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.route  = 'vendor-activation';
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
    this.router.navigate(['add-vendor']);
  }

}
