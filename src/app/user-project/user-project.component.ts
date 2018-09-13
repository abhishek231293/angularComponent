import { Component, OnInit } from '@angular/core';
import {CommonService} from '../_services';

@Component({
  selector: 'app-user-project',
  templateUrl: './user-project.component.html',
  styleUrls: ['./user-project.component.css']
})

export class UserProjectComponent implements OnInit {

  constructor(private _service: CommonService) { }

  ngOnInit() {
    this.getPageRequest();
  }

  /*------------------------------Table with Sorting Starts Here------------------------*/

  fields = [
    { 'field' : 'task_name',
      'title' : 'Task',
      'width' : '27%',
      'sort'  : false
    },
    {
      'field' : 'case_no',
      'title' : 'Project Ref.',
      'width' : '12%',
      'sort'  : false
    },
    {
      'field' : 'task_duration_from',
      'title' : 'Start on',
      'width' : '13%',
      'sort'  : false
    },
      {
      'field' : 'task_duration_to',
      'title' : 'Deadline',
      'width' : '13%',
      'sort'  : false
    },
    { 'field' : 'name',
      'title' : 'Assigned to',
      'width' : '14%',
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
    this.getPageRequest();

  }

  /*------------------------------Table with Sorting Ends Here--------------------------*/

  /*------------------------------Pagination Integration Starts Here------------------------*/
  currentPage: number = 1;
  loader: boolean = false;
  paginate= {
    'last_page' : 1
  };
  route:string;
  searchFields= [];
  pages: any;
  listData = [];
  editData: Object = {};


  previousPage(){
    if(this.currentPage == 1){
      return;
    }

    this.currentPage = this.currentPage -1;
    //console.log(this.currentPage);return;
    this.getPageRequest();

  }

  nextPage() {

    if (this.paginate.last_page-1 < this.currentPage) {
      return;
    }

    this.currentPage ++;
    console.log(this.currentPage);
    this.getPageRequest();
  }

  changePage(){

    this.currentPage = this.currentPage;
    //console.log(this.currentPage);return;
    this.getPageRequest();

  }

  getPages(n){

    var data = [];

    for (var i = 1; i <= n; i++) {
      data.push(i);
    }
    this.pages = data;
    //console.log(this.pages);
  }

  /*------------------------------Pagination Integration Ends Here------------------------*/

  getPageRequest(){

    //this.loading = true;
    const userData = JSON.parse(localStorage.getItem('userData'));
    const token    = localStorage.getItem('userToken');

    this.route  = 'activity-task-details';
    var data = {
      'role_id' : userData['role_id']
    };

    this._service.postRequestCreator(data, this.route, token).subscribe((response: any) => {
      if(response['response'] == 200){
        this.listData = response['result'];
        /*
        this.loading = false;
        this.listData = result;
         this.paginate = result.paginate;
         this.currentPage = result.paginate.current_page;
         if(result.paginate.current_page > result.paginate.last_page){
         this.currentPage = result.paginate.last_page;
         }
         this.getPages(this.paginate.last_page);
         */
      }
    });

    return true;
  }

}
