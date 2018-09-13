import { Component, OnInit } from '@angular/core';
import {CommonService} from '../_services';

@Component({
  selector: 'app-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.css']
})
export class UserActivitiesComponent implements OnInit {

  constructor(private _service: CommonService) { }

  ngOnInit() {
    this.getPageRequest();
  }
  
  /*------------------------------Table with Sorting Starts Here------------------------*/

  fields = [
    {
      'field' : 'case_no',
      'title' : 'Project',
      'width' : '15%',
      'sort'  : false
    },
    { 'field' : 'project_type',
      'title' : 'Type',
      'width' : '28%',
      'sort'  : false
    },
    {
      'field' : 'created_at',
      'title' : 'Created',
      'width' : '33%',
      'sort'  : false
    },
    { 'field' : 'Status',
      'title' : 'Status',
      'width' : '15%',
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

    this.route  = 'activity-log-details';
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
