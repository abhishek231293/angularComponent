import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { CommonService } from '../_services';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import * as $ from 'jquery';

@Component({
  selector: 'app-project-valuation',
  templateUrl: './project-valuation.component.html',
  styleUrls: ['./project-valuation.component.css']
})
export class ProjectValuationComponent implements OnInit {

  projectRow = [];
  projectId = '';
  imgsr = '../../assets/img/p5.png';
  imgCaption = 'Men';
  read = false;
  
  errorResponse = '';
  error = false;
  enabledMode = false;
  loader = false;
  mode;
  isActive = [];
  projects: any;
  evalId;
  selectedTask;

  auth_user = [];
  projectDet: any;
  projectData: any;
  taskData: any;
  imageSet = [{}];
  updateEnable: any;
  newProjectObject: any;
  valuationData:any;
  projectAction: any;
  route:string;
  showList = false;
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
    this.spinner.show();
    this.declaration = false;
    this.selectedTask = {};
    this.selectedTask.branchTypeId = '';
    this.selectedTask.comment = '';
    const userData = JSON.parse(localStorage.getItem('userData'));
    this.user_role = userData.role_id;
    // alert("jj");
    this.projects = [{
      'first_name':'',
      'project_age':''
    }];
    this.updateEnable = {};
    this.activeroute.queryParams.subscribe(params => {
      this.loader = true;
      this.projectId = params['projectid'];
      this.mode = params['mode'];
      /*if(userData.role=='userA' && this.mode=='edit'){
       this.router.navigate(['cases']);
       }*/
      this.getProjects(this.projectId);
      this.editData(0,this.projectId);
    })


    // this.getUserDet();

    this.getValuationList();
    this.newProjectObject = {};
    this.newProjectObject['purpose'] = 2;
    // this.newProjectObject['branchType'] = 6;
    this.newProjectObject['siteProfile'] = {};
    // this.newProjectObject['staffInfo'] = {};
    // this.newProjectObject['imageData'] = '';
    this.isActive['5'] = true;

    setTimeout(()=>{
      this.spinner.hide();
    }, 1000);
  }

  checkIfAllSelected(task_property_evaluation_vendor_id,isChecked: boolean) {

    this.spinner.show();

    if(isChecked){
      this.evalId = task_property_evaluation_vendor_id;
      this.declaration = true;
    }

    this.spinner.hide();

  }

  valuationFields = [
  {
    'field' : 'vendor',
    'title' : 'Vendor',
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
];

  sortType : string = '';
  sortField: string = '';
  oldField: string;
  sortingData= {
    'field' : '',
    'type'  : ''
  };

  refreshValuationList(){
    this.searchData = '';
    this.getValuationList();
  }

  getValuationList(){

    this.spinner.show();
    this.selectedTask = [];
    this.declaration = false;
    this.error = false;
    this.errorResponse = '';
    this.route  = 'get-property-valuation-list';
    const token    = localStorage.getItem('userToken');

    // this._service.getRequestCreator(data, this.route, token).subscribe((result: any) => {
    this._service.postRequestCreator({'projectId':this.projectId,'searchData':this.searchData}, this.route, token).subscribe((response: any) => {
      if(response.status == 'success'){

        this.valuationData = response.data;
        this.enabledMode = response.enabledMode;
        if(this.valuationData.length){
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

  sortBy(field, event){

    this.oldField = (this.oldField != field) ? this.oldField : field;


    if(typeof this.oldField !== 'undefined'){
      //console.log(document.getElementById('fa-'+this.oldField));

      document.getElementById('fa-'+this.oldField).classList.remove('fa-sort-up');
      document.getElementById('fa-'+this.oldField).classList.remove('fa-sort-down');
      document.getElementById('fa-'+this.oldField).classList.add('fa-sort');

    }

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

    this.spinner.show();
    this.route  = 'save-vendor-property-evaluation-response';

    let data = {'evalId':this.evalId, 'action':type,'comment':this.selectedTask.comment,'branchTypeId':this.selectedTask.branchTypeId};
    const token    = localStorage.getItem('userToken');

    this._service.postRequestCreator(data, this.route, token).subscribe((result: any) => {

      if(result.status == 200){
        swal('Success', 'Successfully '+type+'!' , 'success');
      }
      if(result.status == 500){
        swal('Error', 'Something went wrong!' , 'error');
      }

      this.getValuationList();
      setTimeout(()=>{    //<<<---    using ()=> syntax
        this.spinner.hide();
      }, 2000);
    });
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

  selectAll() {
    this.declaration = this.selectedAll;
    for (var i = 0; i < this.projectData.length; i++) {
      this.projectData[i].selected = this.selectedAll;
    }
  }

  goVendorDetails(projectId){
    this.spinner.show();
    this.router.navigate(['vendor-details'],{ queryParams: { projectid: projectId }});
    this.spinner.hide();
  }
}
