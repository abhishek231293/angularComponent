import { Component, OnInit } from '@angular/core';
import { CommonService } from '../_services';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.css']
})
export class MyTaskComponent implements OnInit {
  paginate= {
    'last_page' : 1
  };
  recordsPerPage:number;
  total;
  pages: any;
  currentPage: number = 1;
  searchData:any;
  searchFields:any;

  constructor(private activeroute: ActivatedRoute,private router: Router,
              private _service: CommonService,private spinner: NgxSpinnerService) { }
  tasks:any;
  route:string;
  fields = [
    
    {
      'field' : 'task_name',
      'title' : 'Title',
      'sort'  : true
    },
    {
      'field' : 'case_no.',
      'title' : 'Case No',
      'sort'  : true
    },
    {
      'field' : 'task_duration_from',
      'title' : 'Task Duration From',
      'sort'  : true
    },
    {
      'field' : 'task_duration_to',
      'title' : 'Task Duration To',
      'sort'  : true
    },
    {
      'field' : 'priority',
      'title' : 'Priority',
      'sort'  : true
    },
    {
      'field' : 'task_complete_status',
      'title' : 'Status',
      'sort'  : true
    },
    {
      'field' : 'Action',
      'title' : 'Action',
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
  ngOnInit() {
    this.recordsPerPage = 10;
    this.getAssignedTasks();
    this.searchData = [{
      'task_name':'',
      'task_complete_status':'',
      'priority':'',
      'from':'',
      'to':''
    }];
  }
  getAssignedTasks(){
    this.spinner.show();
    this.route  = 'task-list';
    const token    = localStorage.getItem('userToken');
    this.tasks = [];
    let data = {
      page  : this.currentPage,
      search: this.searchFields,
      sort  : this.sortingData,
      recordsPerPage: this.recordsPerPage,
      token : token
    };
    this._service.postRequestCreator(data, this.route, token).subscribe((response: any) => {
      if(response.status == 'error') {
        this.router.navigate(['login']);
      }
      if(response.status == 'success'){
        this.tasks = response.result;
        this.paginate = response.paginate;
        this.total = response.paginate.total;
        this.currentPage = response.paginate.current_page;
        this.getPages(this.paginate.last_page);
        this.spinner.hide();
      }
    });
  }
  editData(taskAsgnId,projectId, taskId){
    let route = '';
    if(taskId == 2){
      route = 'property-search';
    }else if(taskId == 4){
      route = 'property-valuation';
    }else if(taskId == 6){
      route = 'land-purchase';
    }
    if(route!=''){
      this.router.navigate(['/'+route],{ queryParams: { task_assignment_id: taskAsgnId, project_id:projectId }});
    }
  }

  //sorting, pagination and searching functions start
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
    this.getAssignedTasks();

  }
  previousPage(){
    if(this.currentPage == 1){
      return;
    }

    this.currentPage = this.currentPage -1;
    this.getAssignedTasks();

  }

  nextPage() {

    if (this.paginate.last_page-1 < this.currentPage) {
      return;
    }

    this.currentPage ++;
    console.log(this.currentPage);
    this.getAssignedTasks();
  }

  changePage(){

    this.currentPage = this.currentPage;
    this.getAssignedTasks();

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
    this.searchFields = {
      'task_name': this.searchData[0]['task_name'],
      'task_complete_status': this.searchData[0]['task_complete_status'],
      'priority': this.searchData[0]['priority'],
      'from':this.searchData[0]['from']!=''?this.searchData[0]['from'].toDateString():'',
      'to':this.searchData[0]['to']!=''?this.searchData[0]['to'].toDateString():''
    };
    this.getAssignedTasks();
  }

  refreshList(){
    this.searchData[0]['task_name'] = '';
    this.searchData[0]['task_complete_status'] = '';
    this.searchData[0]['priority'] = '';
    this.searchData[0]['from'] = '';
    this.searchData[0]['to'] = '';
    this.searchFields = {
      'task_name': this.searchData[0]['task_name'],
      'task_complete_status': this.searchData[0]['task_complete_status'],
      'priority': this.searchData[0]['priority'],
      'from':'',
      'to':''
    };
    this.getAssignedTasks();
  }
  //sorting, pagination and searching functions end
}
