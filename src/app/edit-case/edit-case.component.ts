import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonService } from '../_services';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import * as $ from 'jquery';
import {environment} from '../../environments/environment';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-case',
  templateUrl: './edit-case.component.html',
  styleUrls: ['./edit-case.component.css']
})
export class EditCaseComponent implements OnInit {
  lat: number = 23.8859;
  lng: number = 45.0792;
  zoom = 5;
  branchName:string;
  icon:string;
  markerStatus = false;
  projectRow = [];
  projectId = '';
  imgsr = '../../assets/img/p5.png';
  imgCaption = 'Men';
  read = false;
  loader = false;
  mode;
  action_from;
  isActive = [];
  activeTab = '';
  projects: any;
  auth_user = [];
  projectDet: any;
  projectData: any;
  taskData: any;
  imageSet = [{}];
  updateEnable: any;
  newProjectObject: any;
  projectAction: any;
  route:string;
  siteProfileErrorMessage = '';
  staffInfoErrorMessage   = '';
  selectedAll:any;
  hideCtrl = 1;
  paginate= {
    'last_page' : 1
  };
  pages: any;
  currentPage: number = 1;
  searchData: string = '';
  searchFields = { 'case_no': '' };
  declaration;
  public apiBaseUrl: string = environment.apiBaseUrl;
  user_role;
  user_access_role;
  mapTerritory = 0;
  closeResult: string;
  disabledClass = '';
  otherTabVisibility = false;
  projectStatus;
  queryProjectStatus;
  imageArray = [];
  showMapData =0;
  percentageValue: (value: number) => string;
  gaugeValues: any = {
    1: 100,
    2: 18,
    3: 50,
    4: 50,
    5: 50,
    6: 50,
    7: 50
  };
  constructor(private activeroute: ActivatedRoute,private router: Router,
              private _service: CommonService,private spinner: NgxSpinnerService) {

    this.percentageValue = function(value: number): string {
      return `${Math.round(value)} / ${this['max']}`;
    };
  }

  ngOnInit() {
    this.spinner.show();
    const token    = localStorage.getItem('userToken');
    if(!token){
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      this.router.navigate(['login']);
    }
    this.imageArray = [
      { 'id':1,
        'name': 'p1.png',
        'caption':'Ladies'
      },
      { 'id':2,
        'name': 'p2.png',
        'caption':'Airport'
      },
      { 'id':3,
        'name': 'p3.png',
        'caption':'Mall branch'
      },
      { 'id':4,
        'name': 'p4.png',
        'caption':'Tahweel'
      },
      { 'id':5,
        'name': 'p6.png',
        'caption':'Slah'
      },
      { 'id':6,
        'name': 'p5.png',
        'caption':'Men'
      }
    ]
    this.declaration = 0;
    const userData = JSON.parse(localStorage.getItem('userData'));
    this.user_role = userData.role_id;

    this.projects = [{
      'first_name':'',
      'project_age':''
    }];
    this.updateEnable = {};
    this.activeroute.queryParams.subscribe(params => {
      this.loader = true;
      this.projectId = params['projectid'];
      this.mode = params['mode'];
      this.projectStatus = params['project_status'];

      this.getProjects(this.projectId);
      this.editData(0,this.projectId,this.projectStatus);

    })

    this.newProjectObject = {};
    this.newProjectObject['purpose'] = 2;
    this.newProjectObject['branchType'] = 6;
    this.newProjectObject['siteProfile'] = {};
    this.newProjectObject['staffInfo'] = {};
    this.newProjectObject['imageData'] = '';
    this.isActive['5'] = true;
    this.projectData = [{
      'case_no':'Vendor 1',
      'created_at':'15/08/2018 11:50',
      'project_age':'5%',
      'first_name':'500sqm',
      'purpose':'50000SR'
    },{
      'case_no':'Vendor 2',
      'created_at':'15/08/2018 11:50',
      'project_age':'5%',
      'first_name':'500sqm',
      'purpose':'50000SR'
    },{
      'case_no':'Vendor 3',
      'created_at':'15/08/2018 11:50',
      'project_age':'5%',
      'first_name':'500sqm',
      'purpose':'50000SR'
    },{
      'case_no':'Vendor 4',
      'created_at':'15/08/2018 11:50',
      'project_age':'5%',
      'first_name':'500sqm',
      'purpose':'50000SR'
    },{
      'case_no':'Vendor 5',
      'created_at':'15/08/2018 11:50',
      'project_age':'5%',
      'first_name':'500sqm',
      'purpose':'50000SR'
    }];

      this.taskData = [{
          'owner':'Owner 1',
          'date_assigned':'15/08/2018 11:50',
          'status':'5%',
          'type':'500sqm',
      },{
          'owner':'Owner 2',
          'date_assigned':'15/08/2018 11:50',
          'status':'5%',
          'type':'500sqm',
      }];

    setTimeout(()=>{
      this.spinner.hide();
    }, 2000);

  }

  fields = [
    {
      'field' : 'case_no',
      'title' : 'Vendor',
      'width' : '9%',
      'code'  : true,
      'sort'  : true
    },
    {
      'field' : 'first_name',
      'title' : 'Plot Size',
      'width' : '12%',
      'code'  : false,
      'sort'  : true
    },
    {
      'field' : 'purposes.purpose',
      'title' : 'Offer',
      'width' : '12%',
      'code'  : false,
      'sort'  : true
    },
    {
      'field' : 'projects.created_at',
      'title' : 'Date Submitted',
      'width' : '13%',
      'code'  : false,
      'sort'  : true
    },
    {
      'field' : 'project_age',
      'title' : 'Commission Rate',
      'width' : '15%',
      'code'  : false,
      'sort'  : true
    },
    {
      'field' : 'Action',
      'title' : 'Action',
      'width' : '12%',
      'code'  : false,
      'sort'  : false
    }
  ]

    taskFields = [
        {
            'field' : 'owner',
            'title' : 'Owner',
            'width' : '20%',
            'code'  : true,
            'sort'  : true
        },
        {
            'field' : 'date_assigned',
            'title' : 'Date Assigned',
            'width' : '20%',
            'code'  : false,
            'sort'  : true
        },
        {
            'field' : 'status',
            'title' : 'Status',
            'width' : '20%',
            'code'  : false,
            'sort'  : true
        },
        {
            'field' : 'type',
            'title' : 'Type',
            'width' : '20%',
            'code'  : false,
            'sort'  : true
        },
        {
            'field' : 'action',
            'title' : 'Action',
            'width' : '12%',
            'code'  : false,
            'sort'  : false
        }
    ]
  valuationFields = [
    {
      'field' : 'vender',
      'title' : 'Vender',
      'width' : '20%',
      'code'  : true,
      'sort'  : true
    },
    {
      'field' : 'date_submitted',
      'title' : 'Date Submitted',
      'width' : '20%',
      'code'  : false,
      'sort'  : true
    },

    {
      'field' : 'valution',
      'title' : 'Valuation(in SR) ',
      'width' : '25%',
      'code'  : false,
      'sort'  : true
    },
    {
      'field' : 'valution_result',
      'title' : 'Valuation Result',
      'width' : '25%',
      'code'  : false,
      'sort'  : true
    },
    {
      'field' : 'Action',
      'title' : 'Action',
      'width' : '10%',
      'code'  : false,
      'sort'  : false
    }
  ]
  valuationFieldsList=[
    {
      'vender'           : 'Chandan',
      'date_submitted'   : '14/08/2018 11:50',
      'valution'  : '500SR',
      'valution_result'  : 'Above'
    },
    {
      'vender'           : 'Chandan',
      'date_submitted'   : '14/08/2018 11:50',
      'valution'  : '500SR',
      'valution_result'  : 'Above'
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


    this.getProjects();

  }

  viewData(i, project_id){
    this.read = true;
    this.getProjectDetail(project_id);
    if(this.projectRow !== undefined){
      this.projectRow[i] = !this.projectRow[i];
    }
  }
  setSrc(imgSrc,index, e=false){
    // console.log(imgSrc);

    for(let i =0; i<7; i++) {
      this.isActive[i] = false;
    }
    this.isActive[index] = true;
    this.imgsr        = '../../assets/img/'+imgSrc['name'];
    this.imgCaption   = imgSrc['caption'];
  }
  closeAccord(acVal){
    // alert(acVal+'close');
    $("#"+acVal).click();
  }
  toggle(id,projectdet=false,acc = "false") {
    if(acc!='accord'){
      $("#"+id).click();
    }

    if(projectdet){
      this.imageSet = [{
        'name': projectdet['image'],
        'caption':projectdet['caption']
      }]

      this.setSrc(this.imageSet[0],projectdet['branchTypeId']-1);
    }

    id = '#'+id;
    // alert(id);
    $(id+' > .fa-caret-up,'+id +' > .fa-caret-down').toggleClass("fa-caret-up fa-caret-down");

  }

  getProjects(id="false"){
    this.route  = 'project-list';
    let data = {'project_id':id};
    const token    = localStorage.getItem('userToken');
    this._service.postRequestCreator(data, this.route, token).subscribe((response: any) => {
      if(response.status == 204) {
        this.router.navigate(['login']);
      }
      if(response.status == 'success'){
        // this.loader = false;
        this.projects = response.result;
        // alert("herer")
        console.log(this.projects)
      }
    });
  }

  previousPage(){
    if(this.currentPage == 1){
      return;
    }

    this.currentPage = this.currentPage -1;
    //console.log(this.currentPage);return;
    this.getProjects();

  }

  nextPage() {

    if (this.paginate.last_page-1 < this.currentPage) {
      return;
    }

    this.currentPage ++;
    console.log(this.currentPage);
    this.getProjects();
  }

  changePage(){

    this.currentPage = this.currentPage;
    //console.log(this.currentPage);return;
    this.getProjects();

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
    this.searchFields = { 'case_no': this.searchData};
    this.getProjects();
  }

  refreshList(){
    this.searchData = '';
    this.searchFields = { 'case_no': this.searchData};
    this.getProjects();
  }
  getProjectDetail(project_id){
    this.route  = 'project-detail';
    const userData = JSON.parse(localStorage.getItem('userData'));
    let data = {
      'project_id':project_id,
      'role_id':userData.role_id
    };
    this.projectDet = [{'branch_code':''}];
    const token    = localStorage.getItem('userToken');
    this._service.postRequestCreator(data, this.route, token).subscribe((response: any) => {
      if(response.status_code == 200){
        this.projectDet = response.result;
        this.newProjectObject['branchType'] = this.projectDet[0]['branchTypeId'];
        this.setSrc(this.imageArray[this.projectDet[0]['branchTypeId']-1],this.projectDet[0]['branchTypeId']-1);
        this.newProjectObject['siteProfile']['reason'] = this.projectDet[0]['reason'];
        this.newProjectObject['siteProfile']['branchCode'] = this.projectDet[0]['branch_code'];
        this.newProjectObject['siteProfile']['costCenter'] = this.projectDet[0]['cost_center'];
        this.newProjectObject['siteProfile']['budgetCap'] = this.projectDet[0]['budget_cap'];
        this.newProjectObject['siteProfile']['priority'] = this.projectDet[0]['priority'];

        if(this.projectDet[0]['deadline'] != '' || this.projectDet[0]['deadline'] != null){
          var selectedTaskDeadlineDate = this.projectDet[0]['deadline'];
          selectedTaskDeadlineDate = selectedTaskDeadlineDate.split("-").reverse().join("/");
        }else{
          selectedTaskDeadlineDate = '';
        }


        this.newProjectObject['siteProfile']['deadline'] = selectedTaskDeadlineDate;
        this.newProjectObject['staffInfo']['branchManager'] = this.projectDet[0]['total_branch_manager'];
        this.newProjectObject['staffInfo']['operationManager'] = this.projectDet[0]['total_operation_manager'];
        this.newProjectObject['staffInfo']['loungeManager'] = this.projectDet[0]['total_lounge_manager'];
        this.newProjectObject['staffInfo']['showroomSupervisor'] = this.projectDet[0]['total_showroom_supervisor'];
        this.newProjectObject['staffInfo']['headTeller'] = this.projectDet[0]['total_head_teller'];
        this.newProjectObject['staffInfo']['teller'] = this.projectDet[0]['total_teller'];
        this.newProjectObject['staffInfo']['vipTeller'] = this.projectDet[0]['total_vip_teller'];
        this.newProjectObject['staffInfo']['relationshipManager'] = this.projectDet[0]['total_relation_manager'];
        this.newProjectObject['staffInfo']['customerAssistance'] = this.projectDet[0]['total_customers_assistance'];
        this.newProjectObject['staffInfo']['salesAdvisor'] = this.projectDet[0]['total_sales_advisor'];
        this.newProjectObject['staffInfo']['salesManager'] = this.projectDet[0]['total_sales_manager'];
        this.newProjectObject['staffInfo']['salesServiceRep'] = this.projectDet[0]['total_sales_representative'];
        this.newProjectObject['staffInfo']['serviceTellerRep'] = this.projectDet[0]['total_branch_manager'];
        this.newProjectObject['staffInfo']['guard'] = this.projectDet[0]['total_guard'];
        this.newProjectObject['staffInfo']['totalStaff'] = this.projectDet[0]['total_staff'];
        this.newProjectObject['imageData'] = '';
        this.user_access_role = response.auth.user_access_role;
        this.projectId = project_id;
        this.queryProjectStatus = this.projectDet[0]['approve_status'];

        if(this.projectDet[0]['approve_status'] === 'accepted'){
          this.disabledClass = '';
        }

        if(this.projectDet[0]['approve_status'] !== 'accepted'){
          this.disabledClass = 'disabled';
        }
        this.getLatLngBranch();
        // console.log(this.newProjectObject);
      }else{
        this.router.navigate(['login']);
      }
    });
  }
  editData(i, project_id,approveStatus){
    if(this.mode=='view'){
      // alert("test1");
      if(this.queryProjectStatus == 'accepted'){
        this.disabledClass = '';
      }else{
        this.disabledClass = 'disabled';
      }

      this.read = true;
    }else if(this.mode=='edit'){
      this.disabledClass = 'disabled';
      this.read = false;
    }
    this.getProjectDetail(project_id);
    this.projectRow[i] = !this.projectRow[i];
  }
  submitCase(id){
    var returnVar =0
    if(this.newProjectObject['siteProfile']['branchCode']===''){
      returnVar = 1;
      this.siteProfileErrorMessage = 'Please enter branch code.';
    }
    if(isNaN(this.newProjectObject['siteProfile']['branchCode'])){
      returnVar = 1;
      this.siteProfileErrorMessage = 'Branch code chould be a number';
    }
    if(this.newProjectObject['siteProfile']['reason']===''){
      returnVar = 1;
      this.siteProfileErrorMessage = 'Please enter reason(s) for moving.';
    }
    if(this.newProjectObject['staffInfo'].length < 15){
      this.staffInfoErrorMessage = 'All staff fields are mandatory.';
      returnVar = 1;
    }
    for (var key in this.newProjectObject['staffInfo']) {

      if(this.newProjectObject['staffInfo'][key]==='' ){
        this.staffInfoErrorMessage = 'All staff fields are mandatory.';
        returnVar = 1;
      }

      if(isNaN(this.newProjectObject['staffInfo'][key])){
        this.staffInfoErrorMessage = 'All fields should be number type.';
        returnVar = 1;
      }
    }

    if(returnVar==1){
      swal(
          'Error',
          "Please fill all the mandatory details",
          'error'
      )
    }else{
      // this.updateEnable = true;
      this.route  = 'update-project';
      const token    = localStorage.getItem('userToken');
      this.newProjectObject['token'] = token;
      this.newProjectObject['project_id'] = id;

      swal({
        title: 'Are you sure?',
        text: 'You want to save the changes',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonColor: '#d73925',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this._service.postRequestCreator(this.newProjectObject, this.route, token).subscribe((response:any) => {
            // console.log(response);
            if (response.status == 204) {
              this.router.navigate(['login']);
            }
            if (response.status == 'success') {
              swal(
                  'Success',
                  response.message,
                  'success'
              )
              this.getProjects(id);
            } else {
              swal(
                  'Error',
                  response.message,
                  'error'
              )
            }
            // this.updateEnable = false;
          });
          // this.updateEnable = false;
        }
      })

    }
  }
  updateProjectStatus(projectId, action){

    this.updateEnable[action] =1;
    this.route  = 'project-action';
    const usertoken    = localStorage.getItem('userToken');
    // alert(usertoken);
    this.projectAction = {};
    this.projectAction['token'] = usertoken;
    this.projectAction['project_id'] = projectId;
    // this.projectAction['priority'] = action;
    this.projectAction['action'] = action;
    this._service.postRequestCreator(this.projectAction, this.route, usertoken).subscribe((response: any) => {
      // console.log(response);
      if(response.status == 204) {
        this.router.navigate(['login']);
      }
      setTimeout(()=>{
        this.spinner.hide();
        if(response.status == 'success'){
          // this.resetCreateForm();
          swal(
              'Success',
              response.message,
              'success'
          )
          this.disabledClass = '';
          this.otherTabVisibility = true;
          this.router.navigate(['/edit-case'],{ queryParams: { projectid: response.project_id, mode: 'view'}});
        }else{
          swal(
              'Error',
              response.message,
              'error'
          )
        }
        this.updateEnable[action] =0;
      }, 1200);
      // this.updateEnable = false;
    });
    // this.updateEnable = false;
  }

  selectAll() {
    this.declaration = this.selectedAll;
    for (var i = 0; i < this.projectData.length; i++) {
      this.projectData[i].selected = this.selectedAll;
    }
  }
  checkIfAllSelected() {
    this.declaration = 1;
    this.selectedAll = this.projectData.every(function(item:any) {
      item.selected == true;
    })
  }
  changeCtrls(tab){

    this.activeTab = tab;
    
    if(tab=='candidateSites'){
      this.hideCtrl = 0;
      this.mapTerritory = 1;
    }else if(tab=='mapTerritory'){
      this.hideCtrl = 1;
      this.mapTerritory = 1;
    }else{
      this.mapTerritory = 0;
      this.hideCtrl = 1;
    }
  }

  goVendorDetails(projectId){
    this.spinner.show();
    this.router.navigate(['vendor-details'],{ queryParams: { projectid: projectId }});
    this.spinner.hide();
  }

  openSavedImage(apiBaseUrl,img){
    swal({
      title: '',
      text: '',
      imageUrl: apiBaseUrl+'/storage/'+img,
      width: 700,
      imageWidth: 670,
      imageHeight: 470,
      imageAlt: 'Custom Map Image',
      animation: false
    })
  }

  showMap(mapVal){
    //console.log('hi');
    this.showMapData = mapVal;
  }
  getLatLngBranch(){
    // alert(this.newProjectObject['siteProfile'].branchCode);
    this.newProjectObject['branch_code']  = this.newProjectObject['siteProfile']['branchCode'];
    this.route = 'get-latlngbranch';
    const token    = localStorage.getItem('userToken');

    this._service.postRequestCreator(this.newProjectObject, this.route, token).subscribe((response: any) => {
      // console.log('getLatLngBranch',response);
      if(response.status == 'success'){
        this.lat = parseFloat(response.result.latitude);
        this.lng = parseFloat(response.result.longitude);
        this.branchName = response.result.name;
        this.icon = '/../../assets/img/inprogress.png';
        this.zoom = 15;
        this.markerStatus = true;

      }else {
        swal({
          type: 'error',
          title: 'Branch code does not exist!',
          text:  'Please enter correct branch code.'
        })
        // alert('Branch Code does not exist');
      }
    });


  }
}

