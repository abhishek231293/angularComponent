import { Component, OnInit } from '@angular/core';
import { CommonService } from '../_services';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import { FormBuilder, FormControl , FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import {getProjectDetails} from "@angular/cli/utilities/project";
import {environment} from '../../environments/environment';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-evaluation-view',
  templateUrl: './evaluation-view.component.html',
  styleUrls: ['./evaluation-view.component.css']
})
export class EvaluationViewComponent implements OnInit {

  public apiBaseUrl: string = environment.apiBaseUrl;
  projects =  [];
  projectId = '';
  evalId;
  estimatedDays = 100;
  noDocument = false;
  mode;
  loader = false;
  total = 0;
  route:string;
  projectDet = [];
  evaluationFormData:any = [];
  vendor_id = '';
  isView = true;

  constructor(private activeroute: ActivatedRoute,private router: Router,
              private _service: CommonService,private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    const dragAndDrop = $('.dropify').dropify({
      messages: {
        'default': 'Drag and drop a file here or click'
      }
    });

    this.spinner.show();
    const userData = JSON.parse(localStorage.getItem('userData'));

    this.projects = [{
      'first_name':'',
      'project_age':''
    }];

    this.activeroute.queryParams.subscribe(params => {

      this.loader = true;
        this.evalId = params['eval_id'];
        this.projectId = params['project_id'];
        this.mode = params['mode'];
        this.total = params['total'];
        this.getEvaluationDetails();
        this.getEvaluationProsCons();
        this.getEvaluationImage();
        this.getProjects();
        this.getProjectDetail();
    });

    this.evaluationFormData['evaluation_amount'] = '';
    this.evaluationFormData['competition'] = '';
    this.evaluationFormData['pros'] = [];
    this.evaluationFormData['cons'] = [];
    this.evaluationFormData['recommendation'] = '';
    this.evaluationFormData['price'] = 'above';
    this.evaluationFormData['image1'] = '';
    this.evaluationFormData['image2'] = '';
    this.evaluationFormData['image3'] = '';
    this.evaluationFormData['status'] = '';

    setTimeout(()=>{    //<<<---    using ()=> syntax
      this.spinner.hide();
    }, 1000);


  }

  getEvaluationProsCons(){
    this.route  = 'get-evaluation-pros-cons';
    let data = {'eval_id':this.evalId};
    const token    = localStorage.getItem('userToken');

    this._service.postRequestCreator(data, this.route, token).subscribe((response: any) => {

      if(response.status == 204) {
        this.router.navigate(['login']);
      }

      if(response.status == 200){

        if(response.result){

          if(response.result['pros']){
            this.evaluationFormData['pros'] = response.result['pros'];
          }

          if(response.result['cons']){
            this.evaluationFormData['cons'] = response.result['cons'];
          }
        }
      }
    });
  }

  getEvaluationImage(){
    this.route  = 'get-evaluation-images';
    let data = {'eval_id':this.evalId};
    const token    = localStorage.getItem('userToken');

    this._service.postRequestCreator(data, this.route, token).subscribe((response: any) => {

      if(response.status == 204) {
        this.router.navigate(['login']);
      }

      if(response.status == 200){
        this.noDocument = true;

        if(response.result.length){
          if(response.result[0]){
            this.noDocument = false;
            this.evaluationFormData['image1'] = response.result[0]['image_name'];
          }

          if(response.result[1]){
            this.noDocument = false;
            this.evaluationFormData['image2'] = response.result[1]['image_name'];
          }

          if(response.result[2]){
            this.noDocument = false;
            this.evaluationFormData['image3'] = response.result[2]['image_name'];
          }

        }
      }
    });
  }

  actionPerformer(type){
    this.spinner.show();
    this.route  = 'save-vendor-property-evaluation-response';

    let data = {'evalId':this.evalId, 'action':type};
    const token    = localStorage.getItem('userToken');

    this._service.postRequestCreator(data, this.route, token).subscribe((result: any) => {

      if(result.status == 200){
        swal('Success', 'Successfully '+type+'!' , 'success');
      }
      if(result.status == 500){
        swal('Error', 'Something went wrong!' , 'error');
      }

      this.getEvaluationDetails();
      setTimeout(()=>{    //<<<---    using ()=> syntax
        this.spinner.hide();
      }, 2000);
    });
  }

  getEvaluationDetails(){
    this.route  = 'get-evaluation-details';
    let data = {'eval_id':this.evalId};
    const token    = localStorage.getItem('userToken');

    this._service.postRequestCreator(data, this.route, token).subscribe((response: any) => {
      if(response.status == 204) {
        this.router.navigate(['login']);

      }
      if(response.status == 200){

        if(response.result.length){
          this.evaluationFormData['evaluation_amount'] = response.result[0]['evaluation_amount'];
          this.evaluationFormData['competition'] = response.result[0]['competition'];
          this.evaluationFormData['recommendation'] = response.result[0]['broker_recommendation'];
          this.evaluationFormData['price'] = response.result[0]['price_avg'];
          this.evaluationFormData['status'] = response.result[0]['status'];
        }
      }
    });
  }

  getProjects(){
    // this.loader = true;
    this.route  = 'project-list';
    let data = {'project_id':this.projectId};
    const token    = localStorage.getItem('userToken');
    // this._service.getRequestCreator(data, this.route, token).subscribe((result: any) => {
    this._service.postRequestCreator(data, this.route, token).subscribe((response: any) => {
      if(response.status == 204) {
        this.router.navigate(['login']);
      }
      if(response.status == 'success'){
        // this.loader = false;
        this.projects = response.result;

      }
    });


  }

  getProjectDetail(){
    this.route  = 'project-detail';
    let data = {'project_id':this.projectId};
    this.projectDet = [{'branch_code':''}];
    const token    = localStorage.getItem('userToken');
    this._service.postRequestCreator(data, this.route, token).subscribe((response: any) => {
      if(response.status == 'success'){
        this.projectDet = response.result;
      }
    });
  }

}
