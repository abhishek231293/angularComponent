import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { CommonService } from '../_services';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import * as $ from 'jquery';


@Component({
  selector: 'app-project-candidate-sites',
  templateUrl: './project-candidate-sites.component.html',
  styleUrls: ['./project-candidate-sites.component.css']
})
export class ProjectCandidateSitesComponent implements OnInit {

  projectRow = [];
  projectId = '';
  imgsr = '../../assets/img/p5.png';
  imgCaption = 'Men';
  errorResponse = '';
  error = false;
  read = false;
  loader = false;
  selectedTask;
  enabledMode = false;

  selected = false;
  showList = false;

  mode;
  isActive = [];
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
  declaration = false;
  public apiBaseUrl: string = environment.apiBaseUrl;
  user_role;
  constructor(private activeroute: ActivatedRoute,private router: Router,
              private _service: CommonService,private spinner: NgxSpinnerService) { }
  imageArray = [
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
  ];

  ngOnInit() {
    this.declaration = false;

    this.selectedTask = {};
    this.selectedTask.branchTypeId = '';
    this.selectedTask.comment = '';

    const userData = JSON.parse(localStorage.getItem('userData'));
    this.user_role = userData.role_id;
    // alert("jj");
    console.log(userData);
    this.projects = [{
      'first_name':'',
      'project_age':''
    }];
    this.updateEnable = {};
    this.activeroute.queryParams.subscribe(params => {
      this.spinner.show();
      this.loader = true;
      this.projectId = params['projectid'];
      this.mode = params['mode'];
      /*if(userData.role=='userA' && this.mode=='edit'){
       this.router.navigate(['cases']);
       }*/
      this.getProjects(this.projectId);
      this.editData(0,this.projectId);
      setTimeout(()=>{
        this.spinner.hide();
      }, 1000);
    })

    // this.getUserDet();
    // this.getProjects();
    this.newProjectObject = {};
    this.newProjectObject['purpose'] = 2;
    // this.newProjectObject['branchType'] = 6;
    this.newProjectObject['siteProfile'] = {};
    // this.newProjectObject['staffInfo'] = {};
    // this.newProjectObject['imageData'] = '';
    this.isActive['5'] = true;


    this.getCandidateSiteDetails();

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
  }

  fields = [
    {
      'field' : 'name',
      'title' : 'Vendor',
      'width' : '9%',
      'code'  : true,
      'sort'  : true
    },
    {
      'field' : 'assets_size',
      'title' : 'Plot Size',
      'width' : '12%',
      'code'  : false,
      'sort'  : true
    },
    {
      'field' : 'price_range',
      'title' : 'Offer',
      'width' : '12%',
      'code'  : false,
      'sort'  : true
    },
    {
      'field' : 'created_at',
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
      'field' : 'approve_status',
      'title' : 'Status',
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

    // event.target.classList.add('fa');

    // this.sortField = field;
    // this.sortType = (this.sortType == 'desc') ? 'asc' : 'desc';

    // switch(this.sortType){
    //   case 'desc' : {
    //     event.target.classList.remove('fa-sort-up');
    //     event.target.classList.add('fa-sort-down');
    //     this.oldField = field;
    //   }break;
    //   case 'asc'  : {
    //     event.target.classList.remove('fa-sort-down');
    //     event.target.classList.add('fa-sort-up');
    //     this.oldField = field;
    //   }break;
    //   default     : {
    //     event.target.classList.add('fa-sort');
    //   }
    // }

    // this.sortingData = {
    //   'field' : this.sortField,
    //   'type'  : this.sortType
    // };

    //console.log(this.sortingData);
    // this.getProjects();

  }

  // viewData(i, project_id){
  //   this.read = true;
  //   this.getProjectDetail(project_id);
  //   if(this.projectRow !== undefined){
  //     this.projectRow[i] = !this.projectRow[i];
  //   }
  // }
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
    // console.log(projectdet);
    // if(projectdet){
    //   this.imageSet = [{
    //     'name': projectdet['image'],
    //     'caption':projectdet['caption']
    //   }]
    //   // alert(this.imageSet[0]['name']);
    //   this.setSrc(this.imageSet[0],projectdet['branchTypeId']-1);
    // }
    //
    // id = '#'+id;
    // // alert(id);
    // $(id+' > .fa-caret-up,'+id +' > .fa-caret-down').toggleClass("fa-caret-up fa-caret-down");

  }
  //services
  getProjects(id="false"){
    // this.loader = true;
    this.route  = 'project-list';
    let data = {'project_id':id};
    const token    = localStorage.getItem('userToken');
    // this._service.getRequestCreator(data, this.route, token).subscribe((result: any) => {
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
  /*getProjects(id="false"){
   this.spinner.show();
   this.route  = 'project-list';
   let data = {
   page  : this.currentPage,
   search: this.searchFields,
   sort  : this.sortingData
   };
   const token    = localStorage.getItem('userToken');
   this._service.postRequestCreator(data, this.route, token).subscribe((response: any) => {
   // console.log(response.result);
   this.projects = [];
   this.projects[0] = response.result[id];
   console.log(response.result[id]);
   this.projectData = [{
   'case_no':'Vendor 1',
   'created_at':'15-08-2018 11:50:30',
   'project_age':'5%',
   'first_name':'500sqm',
   'purpose':'50000SR'
   },{
   'case_no':'Vendor 2',
   'created_at':'15-08-2018 11:50:30',
   'project_age':'5%',
   'first_name':'500sqm',
   'purpose':'50000SR'
   },{
   'case_no':'Vendor 3',
   'created_at':'15-08-2018 11:50:30',
   'project_age':'5%',
   'first_name':'500sqm',
   'purpose':'50000SR'
   },{
   'case_no':'Vendor 4',
   'created_at':'15-08-2018 11:50:30',
   'project_age':'5%',
   'first_name':'500sqm',
   'purpose':'50000SR'
   },{
   'case_no':'Vendor 5',
   'created_at':'15-08-2018 11:50:30',
   'project_age':'5%',
   'first_name':'500sqm',
   'purpose':'50000SR'
   }];
   // this.projectData[id]['project_age']=response.result[id].project_age;
   /!*if(response.status == 204) {
   this.router.navigate(['login']);
   }
   if(response.status == 'success'){
   this.projects = [];
   this.projects = response.result;
   this.paginate = response.paginate;
   this.total = response.paginate.total;
   this.currentPage = response.paginate.current_page;
   this.getPages(this.paginate.last_page);
   }*!/
   this.spinner.hide();
   });
   }*/
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

  refreshCandidateSiteDetails(){
    this.searchData = '';
    this.getCandidateSiteDetails();
  }
  getProjectDetail(project_id){
    // this.route  = 'project-detail';
    // let data = {'project_id':project_id};
    // this.projectDet = [{'branch_code':''}];
    // const token    = localStorage.getItem('userToken');
    // this._service.postRequestCreator(data, this.route, token).subscribe((response: any) => {
      // if(response.status == 'success'){
        // this.projectDet = response.result;
        // console.log(this.projectDet[0]['branch_code']);
        // this.isActive[this.projectDet['branchTypeId']] = true;
        // this.newProjectObject['branchType'] = this.projectDet[0]['branchTypeId'];
        // this.setSrc(this.imageArray[this.projectDet[0]['branchTypeId']-1],this.projectDet[0]['branchTypeId']-1);
        // this.newProjectObject['siteProfile']['reason'] = this.projectDet[0]['reason'];
        // this.newProjectObject['siteProfile']['branchCode'] = this.projectDet[0]['branch_code'];
        // this.newProjectObject['siteProfile']['costCenter'] = this.projectDet[0]['cost_center'];
        // this.newProjectObject['siteProfile']['budgetCap'] = this.projectDet[0]['budget_cap'];
        // this.newProjectObject['siteProfile']['action'] = this.projectDet[0]['action'];
        // this.newProjectObject['staffInfo']['branchManager'] = this.projectDet[0]['total_branch_manager'];
        // this.newProjectObject['staffInfo']['operationManager'] = this.projectDet[0]['total_operation_manager'];
        // this.newProjectObject['staffInfo']['loungeManager'] = this.projectDet[0]['total_lounge_manager'];
        // this.newProjectObject['staffInfo']['showroomSupervisor'] = this.projectDet[0]['total_showroom_supervisor'];
        // this.newProjectObject['staffInfo']['headTeller'] = this.projectDet[0]['total_head_teller'];
        // this.newProjectObject['staffInfo']['teller'] = this.projectDet[0]['total_teller'];
        // this.newProjectObject['staffInfo']['vipTeller'] = this.projectDet[0]['total_vip_teller'];
        // this.newProjectObject['staffInfo']['relationshipManager'] = this.projectDet[0]['total_relation_manager'];
        // this.newProjectObject['staffInfo']['customerAssistance'] = this.projectDet[0]['total_customers_assistance'];
        // this.newProjectObject['staffInfo']['salesAdvisor'] = this.projectDet[0]['total_sales_advisor'];
        // this.newProjectObject['staffInfo']['salesManager'] = this.projectDet[0]['total_sales_manager'];
        // this.newProjectObject['staffInfo']['salesServiceRep'] = this.projectDet[0]['total_sales_representative'];
        // this.newProjectObject['staffInfo']['serviceTellerRep'] = this.projectDet[0]['total_branch_manager'];
        // this.newProjectObject['staffInfo']['guard'] = this.projectDet[0]['total_guard'];
        // this.newProjectObject['staffInfo']['totalStaff'] = this.projectDet[0]['total_staff'];
        // this.newProjectObject['imageData'] = '';
        // console.log(this.newProjectObject);
      // }
    // });
  }
  editData(i, project_id){
    if(this.mode=='view'){
      // alert("test1");
      this.read = true;
    }else if(this.mode=='edit'){
      // alert("test2");
      this.read = false;
    }
    this.getProjectDetail(project_id);
    this.projectRow[i] = !this.projectRow[i];
  }
  // submitCase(id){
  //   //validation
  //   /*swal({
  //    title: 'Are you sure?',
  //    text: 'You will not be able to recover this imaginary file!',
  //    type: 'warning',
  //    showCancelButton: true,
  //    confirmButtonText: 'Yes, delete it!',
  //    cancelButtonText: 'No, keep it'
  //    }).then((result) => {
  //    if (result.value) {
  //    swal(
  //    'Deleted!',
  //    'Your imaginary file has been deleted.',
  //    'success'
  //    )
  //    // For more information about handling dismissals please visit
  //    // https://sweetalert2.github.io/#handling-dismissals
  //    } else if (result.dismiss === Swal.DismissReason.cancel) {
  //    swal(
  //    'Cancelled',
  //    'Your imaginary file is safe :)',
  //    'error'
  //    )
  //    }
  //    })
  //    return;*/
  //   var returnVar =0
  //   if(this.newProjectObject['siteProfile']['branchCode']===''){
  //     returnVar = 1;
  //     this.siteProfileErrorMessage = 'Please enter branch code.';
  //   }
  //   if(isNaN(this.newProjectObject['siteProfile']['branchCode'])){
  //     returnVar = 1;
  //     this.siteProfileErrorMessage = 'Branch code chould be a number';
  //   }
  //   if(this.newProjectObject['siteProfile']['reason']===''){
  //     returnVar = 1;
  //     this.siteProfileErrorMessage = 'Please enter reason(s) for moving.';
  //   }
  //   if(this.newProjectObject['staffInfo'].length < 15){
  //     this.staffInfoErrorMessage = 'All staff fields are mandatory.';
  //     returnVar = 1;
  //   }
  //   for (var key in this.newProjectObject['staffInfo']) {
  //
  //     if(this.newProjectObject['staffInfo'][key]==='' ){
  //       this.staffInfoErrorMessage = 'All staff fields are mandatory.';
  //       returnVar = 1;
  //     }
  //
  //     if(isNaN(this.newProjectObject['staffInfo'][key])){
  //       this.staffInfoErrorMessage = 'All fields should be number type.';
  //       returnVar = 1;
  //     }
  //   }
  //   // this.siteProfileErrorMessage = '';
  //   if(returnVar==1){
  //     swal(
  //         'Error',
  //         "Please fill all the mandatory details",
  //         'error'
  //     )
  //   }else{
  //     // this.updateEnable = true;
  //     this.route  = 'update-project';
  //     const token    = localStorage.getItem('userToken');
  //     this.newProjectObject['token'] = token;
  //     this.newProjectObject['project_id'] = id;
  //     // alert("this.newProjectObject");
  //     // console.log(this.newProjectObject);
  //     swal({
  //       title: 'Are you sure?',
  //       text: 'You want to save the changes',
  //       type: 'warning',
  //       showCancelButton: true,
  //       confirmButtonText: 'Yes',
  //       cancelButtonColor: '#d73925',
  //       cancelButtonText: 'No'
  //     }).then((result) => {
  //       if (result.value) {
  //         this._service.postRequestCreator(this.newProjectObject, this.route, token).subscribe((response:any) => {
  //           // console.log(response);
  //           if (response.status == 204) {
  //             this.router.navigate(['login']);
  //           }
  //           if (response.status == 'success') {
  //             swal(
  //                 'Success',
  //                 response.message,
  //                 'success'
  //             )
  //             this.getProjects(id);
  //           } else {
  //             swal(
  //                 'Error',
  //                 response.message,
  //                 'error'
  //             )
  //           }
  //           // this.updateEnable = false;
  //         });
  //         // this.updateEnable = false;
  //       }
  //     })
  //
  //   }
  // }
  // updateProjectStatus(projectId, action){
  //   // alert(projectId);
  //   // alert(action);
  //   this.updateEnable[action] =1;
  //   this.route  = 'project-action';
  //   const usertoken    = localStorage.getItem('userToken');
  //   // alert(usertoken);
  //   this.projectAction = {};
  //   this.projectAction['token'] = usertoken;
  //   this.projectAction['project_id'] = projectId;
  //   this.projectAction['action'] = action;
  //   this._service.postRequestCreator(this.projectAction, this.route, usertoken).subscribe((response: any) => {
  //     // console.log(response);
  //     if(response.status == 204) {
  //       this.router.navigate(['login']);
  //     }
  //     setTimeout(()=>{    //<<<---    using ()=> syntax
  //       this.spinner.hide();
  //       if(response.status == 'success'){
  //         // this.resetCreateForm();
  //         swal(
  //             'Success',
  //             response.message,
  //             'success'
  //         )
  //       }else{
  //         swal(
  //             'Error',
  //             response.message,
  //             'error'
  //         )
  //       }
  //       this.updateEnable[action] =0;
  //     }, 1200);
  //     // this.updateEnable = false;
  //   });
  //   // this.updateEnable = false;
  // }
  /*getUserDet(){
   this.route  = 'user-detail';
   const usertoken    = localStorage.getItem('userToken');
   this.auth_user['token'] = usertoken;
   this._service.postRequestCreator({token:usertoken}, this.route, usertoken).subscribe((response: any) => {
   if(response.status == 204) {
   this.router.navigate(['login']);
   }
   if(response.status == 'success'){
   this.auth_user = response.result;
   console.log(this.auth_user);
   }else{

   }
   });
   }*/
  selectAll() {
    // this.declaration = this.selectedAll;
    // for (var i = 0; i < this.projectData.length; i++) {
    //   this.projectData[i].selected = this.selectedAll;
    // }
  }
  
  checkIfAllSelected(task_property_search_vendor_id,fk_vendor_id,fk_task_property_search_valuation_id, isChecked: boolean) {

    this.spinner.show();

    if(isChecked){
      this.selectedTask.task_property_search_vendor_id = task_property_search_vendor_id;
      this.selectedTask.fk_vendor_id = fk_vendor_id;
      this.selectedTask.fk_task_property_search_valuation_id = fk_task_property_search_valuation_id;
      this.declaration = true;
    }

    this.spinner.hide();

  }

  actionPerformer(type){

    this.error = false;
    this.errorResponse = '';

    if(this.selectedTask.comment == '' || this.selectedTask.comment == null){
        this.error = true;
        this.errorResponse = 'Please provide feedback.';
    }

    if(!this.selectedTask.branchTypeId || this.selectedTask.branchTypeId == ''){
      this.errorResponse = 'Please select branch type.';
      this.error = true;
    }

    if(this.error){
      return;
    }

    let input = new FormData();
    input.append('projectId', this.projectId);
    input.append('action', type);
    input.append('comment',this.selectedTask.comment);
    input.append('branchTypeId',this.selectedTask.branchTypeId);
    input.append('task_property_search_vendor_id',this.selectedTask.task_property_search_vendor_id);
    input.append('fk_vendor_id',this.selectedTask.fk_vendor_id);
    input.append('fk_task_property_search_valuation_id',this.selectedTask.fk_task_property_search_valuation_id);

    this.spinner.show();
    this.route  = 'save-vendor-property-search-response';

    const token    = localStorage.getItem('userToken');

    this._service.postRequestCreator(input, this.route, token).subscribe((result: any) => {

      if(result.status == 200){
        swal('Success', 'Task successfully '+type+'!' , 'success');
      }
      if(result.status == 500){
        swal('Error', 'Something went wrong!' , 'error');
      }

      this.getCandidateSiteDetails();
      setTimeout(()=>{    //<<<---    using ()=> syntax
        this.spinner.hide();
      }, 2000);
    });
  }
  // changeCtrls(tab){
  //   if(tab=='candidateSites'){
  //     this.hideCtrl = 0;
  //   }else{
  //     this.hideCtrl = 1;
  //   }
  // }

  goVendorDetails(projectId){
    this.spinner.show();
    this.router.navigate(['vendor-details'],{ queryParams: { projectid: projectId }});
    this.spinner.hide();
  }

  getCandidateSiteDetails(){

    this.spinner.show();
    this.selectedTask = [];
    this.declaration = false;
    this.error = false;
    this.errorResponse = '';
    this.route  = 'get-candidate-site-detail';
    const token    = localStorage.getItem('userToken');

    // this._service.getRequestCreator(data, this.route, token).subscribe((result: any) => {
    this._service.postRequestCreator({'projectId':this.projectId,'searchData':this.searchData}, this.route, token).subscribe((response: any) => {
      if(response.status == 'success'){

        this.projectData = response.data;
        this.enabledMode = response.enabledMode;
        let count = this.projectData?this.projectData.length:0;
        if(count){
          this.showList = true;
        }else{
          this.showList = false;
        }
      }
      setTimeout(()=>{
        this.spinner.hide();
      }, 1000);
    });
  }

}
