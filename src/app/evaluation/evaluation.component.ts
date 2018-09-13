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
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {

  public apiBaseUrl: string = environment.apiBaseUrl;
  projects =  [];
  projectId = '';
  loader = false;
  route:string;
  projectDet = [];
  evaluationFormData:any = [];
  vendor_id = '';
  is_evaluation_form = true;
  search_evl_id = '';
  vendorDetail:any;
  estimatedDays:number;
  completedDays:number;
  documentsList:any;
  evaluationFormError = false;

  uploadFile1:FileList;
  uploadFile2:FileList;
  uploadFile3:FileList;

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
      this.projectId = params['project_id'];
      this.vendor_id = params['vendor_id'];
      this.search_evl_id = params['search_evl_id'];
      this.is_evaluation_form = params['is_evaluation_form'];
      //
      // this.getProjects(this.projectId);
      // this.getProjectDetail(this.projectId);
    })

    this.evaluationFormData['evaluation_amount'] = '';
    this.evaluationFormData['competition'] = '';
    this.evaluationFormData['pros'] = [];
    this.evaluationFormData['prosText'] = '';
    this.evaluationFormData['cons'] = [];
    this.evaluationFormData['consText'] = '';
    this.evaluationFormData['recommendation'] = '';
    this.evaluationFormData['price'] = 'above';


    this.evaluationFormData['evaluation_amount_error'] = false;
    this.evaluationFormData['competition_error'] = false;
    this.evaluationFormData['pros_error'] = false;
    this.evaluationFormData['cons_error'] = false;
    this.evaluationFormData['recommendation_error'] = false;
    this.evaluationFormData['price_error'] = false;
    this.evaluationFormData['image_error'] = false;

    setTimeout(()=>{    //<<<---    using ()=> syntax
      this.spinner.hide();
    }, 1000);


  }

  resetEvaluationForm(){
    this.evaluationFormData['evaluation_amount'] = '';
    this.evaluationFormData['competition'] = '';
    this.evaluationFormData['pros'] = [];
    this.evaluationFormData['prosText'] = '';
    this.evaluationFormData['cons'] = [];
    this.evaluationFormData['consText'] = '';
    this.evaluationFormData['recommendation'] = '';
    this.evaluationFormData['price'] = 'above';
    $('.dropify-clear').trigger('click');
  }

  addProsCons(type){

    if(this.evaluationFormData[type+'Text']){
      (this.evaluationFormData[type]).push(this.evaluationFormData[type+'Text']);
      // this.evaluationFormData[type][Object.keys(this.evaluationFormData[type]).length] = this.evaluationFormData[type+'Text'];
    }

    this.evaluationFormData[type+'Text'] = '';
    console.log(this.evaluationFormData[type]);
  }

  removeProsCons(type,index){
    this.evaluationFormData[type].splice(index, 1);
  }

  validateEvaluationForm(){

    this.evaluationFormError = false;
    this.evaluationFormData['evaluation_amount_error'] = false;
    this.evaluationFormData['competition_error'] = false;
    this.evaluationFormData['pros_error'] = false;
    this.evaluationFormData['cons_error'] = false;
    this.evaluationFormData['recommendation_error'] = false;
    this.evaluationFormData['price_error'] = false;
    this.evaluationFormData['image_error'] = false;

    if(!this.evaluationFormData['evaluation_amount'] || this.evaluationFormData['evaluation_amount'] == '' || this.evaluationFormData['evaluation_amount'] == null){
      this.evaluationFormError = true;
      this.evaluationFormData['evaluation_amount_error'] = true;
    }

    if(!this.evaluationFormData['competition'] || this.evaluationFormData['competition'] == '' || this.evaluationFormData['competition'] == null){
      this.evaluationFormError = true;
      this.evaluationFormData['competition_error'] = true;
    }

    if(!this.evaluationFormData['recommendation'] || this.evaluationFormData['recommendation'] == '' || this.evaluationFormData['recommendation'] == null){
      this.evaluationFormError = true;
      this.evaluationFormData['recommendation_error'] = true;
    }

    if(!this.evaluationFormData['price'] || this.evaluationFormData['price'] == '' || this.evaluationFormData['price'] == null){
      this.evaluationFormError = true;
      this.evaluationFormData['price_error'] = true;
    }

    if(!this.evaluationFormData['pros'].length){
      this.evaluationFormError = true;
      this.evaluationFormData['pros_error'] = true;
    }

    if(!this.evaluationFormData['cons'].length){
      this.evaluationFormError = true;
      this.evaluationFormData['cons_error'] = true;
    }

    if(!this.uploadFile1 && !this.uploadFile2 && !this.uploadFile3){
      this.evaluationFormError = true;
      this.evaluationFormData['image_error'] = true;
    }else{
      if(this.uploadFile1){
        if(!this.uploadFile1.length){
          this.evaluationFormError = true;
          this.evaluationFormData['image_error'] = true;
        }
      }
      if(this.uploadFile2){
        if(!this.uploadFile2.length){
          this.evaluationFormError = true;
          this.evaluationFormData['image_error'] = true;
        }
      }
      if(this.uploadFile3){
        if(!this.uploadFile3.length){
          this.evaluationFormError = true;
          this.evaluationFormData['image_error'] = true;
        }
      }
    }
  }

  submitEvaluationForm(){

    this.spinner.show();
    this.validateEvaluationForm();

    if(this.evaluationFormError){
      setTimeout(()=>{    //<<<---    using ()=> syntax
        this.spinner.hide();
      }, 1000);
      // swal("Error..!", 'All field required.', 'warning');
      return;
    }

    this.route  = 'property-evaluation-response';
    let fileUpload1 : File;
    let fileUpload2 : File;
    let fileUpload3 : File;

    if(this.uploadFile1){
      fileUpload1 = this.uploadFile1.item(0);
    }
    if(this.uploadFile2){
      fileUpload2 = this.uploadFile2.item(0);
    }

    if(this.uploadFile3){
      fileUpload3 = this.uploadFile3.item(0);
    }

    const formData = new FormData();

    if(fileUpload1){
      formData.append('upload1',fileUpload1,fileUpload1.name);
    }

    if(fileUpload2){
      formData.append('upload2',fileUpload2,fileUpload2.name);
    }

    if(fileUpload3){
      formData.append('upload3',fileUpload3,fileUpload3.name);
    }
    formData.append('evaluation_amount',this.evaluationFormData['evaluation_amount']);
    formData.append('competition',this.evaluationFormData['competition']);
    formData.append('pros',this.evaluationFormData['pros']);
    formData.append('cons',this.evaluationFormData['cons']);
    formData.append('recommendation',this.evaluationFormData['recommendation']);
    formData.append('price',this.evaluationFormData['price']);
    formData.append('projectId',this.projectId);
    formData.append('vendor_id',this.vendor_id);
    formData.append('search_evl_id',this.search_evl_id);

    // const token    = localStorage.getItem('userToken');
    // this._service.getRequestCreator(data, this.route, token).subscribe((result: any) => {
    this._service.postRequestNoTokenCreator(formData, this.route).subscribe((response: any) => {

      setTimeout(()=>{    //<<<---    using ()=> syntax
        this.spinner.hide();
      }, 1000);

      if(response.status == 'success'){
        swal("Success", 'Property evaluation successful', 'success');
        this.resetEvaluationForm();
      }

      if(response.status == 'error'){
        swal("Error..!", 'Something went wrong! Please try again.', 'warning');
      }
    });

  }

  getProjects(id="false"){
    // this.loader = true;
    this.route  = 'project-list';
    let data = {'project_id':id};
    // const token    = localStorage.getItem('userToken');
    // this._service.getRequestCreator(data, this.route, token).subscribe((result: any) => {
    this._service.postRequestNoTokenCreator(data, this.route).subscribe((response: any) => {

      if(response.status == 'success'){
        // this.loader = false;
        this.projects = response.result;

      }
    });


  }

  public changeListener(files: FileList,number){

    if(number == 1){
      this.uploadFile1 = files;
    }else if(number == 2){
      this.uploadFile2 = files;
    }else{
      this.uploadFile3 = files;
    }
  }

  getProjectDetail(project_id){
    this.route  = 'project-detail';
    let data = {'project_id':project_id};
    this.projectDet = [{'branch_code':''}];
    // const token    = localStorage.getItem('userToken');
    this._service.postRequestNoTokenCreator(data, this.route).subscribe((response: any) => {
      if(response.status == 'success'){
        this.projectDet = response.result;
      }
    });
  }

}
