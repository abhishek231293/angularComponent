import { Component, OnInit } from '@angular/core';
import { CommonService } from '../_services';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import * as $ from 'jquery';
import {getProjectDetails} from "@angular/cli/utilities/project";
import {environment} from '../../environments/environment';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.css']
})
export class VendorDetailsComponent implements OnInit {

  projects: any;
  projectId;
  vendorId;
  allowAction = false;
  taskId;
  totalResponse;
  loader = false;
  route:string;
  projectDet:any;
  vendorDetail:any;
  estimatedDays:number;
  completedDays:number;
  documentsList:any;
  searchId;


  public apiBaseUrl: string = environment.apiBaseUrl;
  constructor(private activeroute: ActivatedRoute,private router: Router,
              private _service: CommonService,private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    const userData = JSON.parse(localStorage.getItem('userData'));

    this.projects = [{
      'first_name':'',
      'project_age':''
    }];

    this.activeroute.queryParams.subscribe(params => {

      this.loader = true;
      this.projectId = params['project_id'];
      this.totalResponse = params['total_response'];
      this.vendorId = params['vendorid'];
      this.taskId = params['taskid'];
      this.searchId = params['search_id'];
    });

    if(this.totalResponse >=3){
      this.allowAction = true;
    }

    this.getPropertyResponseDetail();

    this.documentsList = [{
      'name':'Architectural Drawing',
      'file_name':'dummy1.pdf'
    },
      {
        'name':'Street view at least 3 photo',
        'file_name':'dummy2.pdf'
      },
      {
        'name':'Satellite imagery',
        'file_name':'dummy1.pdf'
      },
      {
        'name':'master Plan for area',
        'file_name':'dummy2.pdf'
      }];

    this.estimatedDays = 100;
    this.completedDays = 70;

  }

  actionPerformer(type){
    this.spinner.show();
    this.route  = 'save-vendor-property-search-response';

    let data = {'vendorId':this.vendorId, 'projectId':this.projectId, 'taskId':this.taskId, 'action':type,'searchId':this.searchId};
    const token    = localStorage.getItem('userToken');

    this._service.postRequestCreator(data, this.route, token).subscribe((result: any) => {

      if(result.status == 200){
        swal('Success', 'Task successfully '+type+'!' , 'success');
      }
      if(result.status == 500){
        swal('Error', 'Something went wrong!' , 'error');
      }

      this.getPropertyResponseDetail();
      setTimeout(()=>{    //<<<---    using ()=> syntax
        this.spinner.hide();
      }, 2000);
    });
  }

  getPropertyResponseDetail(){

    this.route  = 'get-property-response-detail';

    let data = {'projectId':this.projectId,'vendorId':this.vendorId,'taskId':this.taskId,'search_id':this.searchId};
    const token    = localStorage.getItem('userToken');

    this._service.postRequestCreator(data, this.route, token).subscribe((result: any) => {

      this.vendorDetail = result;

      setTimeout(()=>{    //<<<---    using ()=> syntax
        this.spinner.hide();
      }, 2000);
    });
  }

  backToEdit(){
    this.spinner.show();
    this.router.navigate(['edit-case'],{ queryParams: { projectid: this.projectId,mode: 'view' }});
    this.spinner.hide();
  }

}
