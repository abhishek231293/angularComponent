import { Component, OnInit } from '@angular/core';
import { CommonService } from '../_services';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import {getProjectDetails} from "@angular/cli/utilities/project";
import {environment} from '../../environments/environment';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
// import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.css']
})
export class CasesComponent implements OnInit {
    projectRow = [];
    loader = false;
    imgsr = '../../assets/img/p5.png';
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
    staffInfoErrorMessage   = '';
    paginate= {
        'last_page' : 1
    };
    pages: any;
    currentPage: number = 1;
    searchData: string = '';
    searchFields = { 'case_no': '' };
    blinkid;
    public apiBaseUrl: string = environment.apiBaseUrl;
    user_role;
    user_access_role;
    imageArray = [];
    constructor(private router: Router,
                private _service: CommonService,private spinner: NgxSpinnerService) { }

    ngOnInit() {

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

        const userData = JSON.parse(localStorage.getItem('userData'));
        this.user_role = userData.role_id;
        if (userData!=null) {
            this.auth_user['role'] = userData['role'];
        }else{

            this.router.navigate(['login']);
        }

        this.getProjects();
        this.newProjectObject['purpose'] = 2;
        this.newProjectObject['branchType'] = 6;
        this.newProjectObject['siteProfile'] = {};
        this.newProjectObject['staffInfo'] = {};
        this.newProjectObject['imageData'] = '';
        this.isActive['5'] = true;        
        this.blinkid = setInterval(() => {
            this.blinker();
        }, 1000);
    }

    fields = [
        {
            'field' : 'case_no',
            'title' : 'Case No',
            'width' : '9%',
            'code'  : true,
            'sort'  : true
        },
        {
            'field' : 'first_name',
            'title' : 'Requested By',
            'width' : '12%',
            'code'  : false,
            'sort'  : true
        },
        {
            'field' : 'purposes.purpose',
            'title' : 'Purpose',
            'width' : '32%',
            'code'  : false,
            'sort'  : true
        },
        {
            'field' : 'projects.created_at',
            'title' : 'Date',
            'width' : '10%',
            'code'  : false,
            'sort'  : true
        },
        {
            'field' : 'project_age',
            'title' : 'Deadline',
            'width' : '9%',
            'code'  : false,
            'sort'  : true
        },
        {
            'field' : 'approve_status',
            'title' : 'Approval Status',
            'width' : '12%',
            'code'  : false,
            'sort'  : false
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
        console.log(imgSrc);

        for(let i =0; i<7; i++) {
            this.isActive[i] = false;
        }
        this.isActive[index] = true;
        this.imgsr        = '../../assets/img/'+imgSrc['name'];
        this.imgCaption   = imgSrc['caption'];
    }
    closeAccord(acVal){
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

        $(id+' > .fa-caret-up,'+id +' > .fa-caret-down').toggleClass("fa-caret-up fa-caret-down");

    }

    getProjects(){

        this.spinner.show();
        this.route  = 'project-list';
        let data = {
            page  : this.currentPage,
            search: this.searchFields,
            sort  : this.sortingData
        };

        const token    = localStorage.getItem('userToken');

        this._service.postRequestCreator(data, this.route, token).subscribe((response: any) => {
            this.projects = [];
            if(response.status_code == 204) {
                this.router.navigate(['login']);
            }
            if(response.status_code == 200){

                this.user_access_role = response.auth.user_access_role;
                this.projects = [];
                this.projects = response.result;
                this.paginate = response.paginate;
                this.total = response.paginate.total;
                this.currentPage = response.paginate.current_page;
                this.getPages(this.paginate.last_page);
            }
            this.spinner.hide();
        });
    }
    getProjectDetail(project_id){
        this.route  = 'project-detail';
        let data = {'project_id':project_id};
        const token    = localStorage.getItem('userToken');
        this._service.postRequestCreator(data, this.route, token).subscribe((response: any) => {
            if(response.status == 'success'){
                this.projectDet = response.result;

                this.newProjectObject['branchType'] = this.projectDet[0]['branchTypeId'];
                this.newProjectObject['siteProfile']['reason'] = this.projectDet[0]['reason'];
                this.newProjectObject['siteProfile']['branchCode'] = this.projectDet[0]['branch_code'];
                this.newProjectObject['siteProfile']['costCenter'] = this.projectDet[0]['cost_center'];
                this.newProjectObject['siteProfile']['budgetCap'] = this.projectDet[0]['budget_cap'];
                this.newProjectObject['siteProfile']['action'] = this.projectDet[0]['action'];
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
                // console.log(this.newProjectObject);
            }
        });
    }
    editData(i, project_id, mode='',status){
        this.router.navigate(['/edit-case'],{ queryParams: { projectid: project_id, mode:mode,project_status:status}});
        // this.read = false;
    }
    submitCase(id) {
        var returnVar =0;
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
            this.updateEnable = true;
            this.route  = 'update-project';
            const token    = localStorage.getItem('userToken');
            this.newProjectObject['token'] = token;
            this.newProjectObject['project_id'] = id;
            this._service.postRequestCreator(this.newProjectObject, this.route, token).subscribe((response: any) => {
                if(response.status == 204) {
                    this.router.navigate(['login']);
                }
                if(response.status == 'success'){
                    swal(
                        'Success',
                        response.message,
                        'success'
                    )
                }else{
                    swal(
                        'Error',
                        response.message,
                        'error'
                    )
                }
                this.updateEnable = false;
            });
            this.updateEnable = false;


        }
    }
    updateProjectStatus(projectId, action){
        this.route  = 'project-action';
        const usertoken    = localStorage.getItem('userToken');
        this.projectAction['token'] = usertoken;
        this.projectAction['project_id'] = projectId;
        this.projectAction['action'] = action;
        this._service.postRequestCreator(this.projectAction, this.route, usertoken).subscribe((response: any) => {
            // console.log(response);
            if(response.status == 204) {
                this.router.navigate(['login']);
            }
            if(response.status == 'success'){
                swal(
                    'Success',
                    response.message,
                    'success'
                )
            }else{
                swal(
                    'Error',
                    response.message,
                    'error'
                )
            }
            this.updateEnable = false;
        });
        this.updateEnable = false;
    }
    previousPage(){
        if(this.currentPage == 1){
            return;
        }

        this.currentPage = this.currentPage -1;
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
        this.getProjects();

    }

    getPages(n){

        var data = [];

        for (var i = 1; i <= n; i++) {
            data.push(i);
        }
        this.pages = data;
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

    blinker() {
        $('.flashInOut').fadeOut(500);
        $('.flashInOut').fadeIn(500);
    }
    ngOnDestroy() {
        if (this.blinkid) {
            clearInterval(this.blinkid);
        }
    }

    goToTask(i, project_id,taskStatus){
        this.router.navigate(['/project-ref'],{ queryParams: { projectid: project_id }});

    }
}
