import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { CommonService } from '../_services';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import {environment} from '../../environments/environment';
import * as html2canvas from 'html2canvas';


@Component({
  selector: 'app-create-case',
  templateUrl: './create-case.component.html',
  styleUrls: ['./create-case.component.css']
})
export class CreateCaseComponent implements OnInit {

  public apiBaseUrl: string  = environment.apiBaseUrl;
  imgCaption = 'Men';
  activeOption:string = 'selectType';
  route:string;
  selectedProjectType:number = 1;
  submitButtonText = 'Finish & Submit';
  submitEnable:boolean = false;
  projectCategory=[];
  newProjectObject = {};
  imgsr = '../../assets/img/p5.png';
  isActive = [];
  public branchType = <any>{};

  siteProfileErrorMessage = '';
  staffInfoErrorMessage   = '';

  constructor(private router: Router,
              private _service: CommonService) { }


  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    this.newProjectObject['selectedProjectType'] = 1;
    this.newProjectObject['purpose'] = 2;
    this.newProjectObject['branchType'] = 6;
    this.newProjectObject['siteProfile'] = {};
    this.newProjectObject['staffInfo'] = {};
    this.newProjectObject['imageData'] = '';
    this.getProjectCategory();
    this.isActive['5'] = true;
  }

  setProjectType(projectid:number){
    this.selectedProjectType = projectid;
    // this.newProjectObject.selectedProjectType = this.selectedProjectType;
  }

  getProjectCategory(){
    this.route  = 'category-list';
    let data = null;

    const token    = localStorage.getItem('userToken');
    // this._service.getRequestCreator(data, this.route, token).subscribe((result: any) => {
    this._service.postRequestCreator(data, this.route, token).subscribe((response: any) => {
        this.projectCategory = [];

        if(response.status == 204) {
          this.router.navigate(['login']);
        }
        if(response.status == 'success'){
            this.projectCategory = [];
            this.projectCategory = response.result;
        }
    });

  }
  imageArray = [
    {
      'id':1,
      'name': 'p1.png',
      'caption':'Ladies'
    },
    {
      'id':2,
      'name': 'p2.png',
      'caption':'Airport'
    },
    {
      'id':3,
      'name': 'p3.png',
      'caption':'Mall branch'
    },
    {
      'id':4,
      'name': 'p4.png',
      'caption':'Tahweel'
    },
    {
      'id':5,
      'name': 'p6.png',
      'caption':'Slah'
    },
    {
      'id':6,
      'name': 'p5.png',
      'caption':'Men'
    }
  ]
  setSrc(imgSrc,index){

    for(let i =0; i<7; i++) {
      this.isActive[i] = false;
    }
    this.isActive[index] = true;
    this.imgsr        = '../../assets/img/'+imgSrc.name;
    this.imgCaption   = imgSrc.caption;
  }
  closeAccord(acVal){
    $("#"+acVal).click();
  }
  toggle(id) {
    // alert("test");
    id = '#'+id;
    $(id+' > .fa-caret-up,'+id +' > .fa-caret-down').toggleClass("fa-caret-up fa-caret-down");

  }

  goToNextOption(nextOption:string){

    if(nextOption == 'branchType'){

      /*
      if(Object.keys(this.newProjectObject['siteProfile']).length < 2){
        this.siteProfileErrorMessage = 'Please fill required fields';
        return;
      }
      */


      var siteProfileFields = Object.keys(this.newProjectObject['siteProfile']);
      //console.log(siteProfileFields);return;

      if(siteProfileFields.indexOf("branchCode") == -1){
        this.siteProfileErrorMessage = 'Please fill mandatory fields.';
        this.goToTop();
        return;
      }

      if(siteProfileFields.indexOf("reason") == -1){
        this.siteProfileErrorMessage = 'Please fill mandatory fields.';
        this.goToTop();
        return;
      }


      var dataToreturn = true;
      for (var key in this.newProjectObject['siteProfile']) {

        switch(key){
          case 'branchCode' :{
            if(isNaN(this.newProjectObject['siteProfile'][key])){
              this.siteProfileErrorMessage = 'Branch code should be number.';
              dataToreturn = false;
            }
          }break;

          case 'reason' :{
            if(!this.newProjectObject['siteProfile'][key]){
              this.siteProfileErrorMessage = 'Reason is required.';
              dataToreturn = false;
            }
          }break;
          default :

        }

      }

      if(!dataToreturn){
        this.goToTop();
        return false;
      }
      this.siteProfileErrorMessage = '';

      //console.log(this.newProjectObject['siteProfile'][key]);return;
    }

    if(nextOption == 'staffCount'){

      if(Object.keys(this.newProjectObject['staffInfo']).length < 15){
        // this.staffInfoErrorMessage = 'All fields are required.';
        // this.goToTop();
        // return;
      }

      for (var key in this.newProjectObject['staffInfo']) {

        if(!this.newProjectObject['staffInfo'][key]){
          // this.staffInfoErrorMessage = 'All fields are required.';
          // this.goToTop();
          // return false;
        }

        if(isNaN(this.newProjectObject['staffInfo'][key])){
          this.staffInfoErrorMessage = 'All fields should be number type.';
          //console.log(key);
          //console.log(this.newProjectObject['staffInfo'][key]);
          this.goToTop();
          return false;
        }
      }

      /*
      if(!dataToreturn){
        return false;
      }
*/
      
      $('#closeStaffCountModalButton').trigger('click');
      
      this.staffInfoErrorMessage = '';
      return;

    }

    this.activeOption = nextOption;

  }

  resetCreateForm(){
    this.newProjectObject = {};
    this.newProjectObject['selectedProjectType'] = 1;
    this.newProjectObject['purpose'] = 2;
    this.newProjectObject['branchType'] = 6;
    this.newProjectObject['siteProfile'] = {};
    this.newProjectObject['staffInfo'] = {};
    this.activeOption = 'selectType';
    this.selectedProjectType = 1;
    this.branchType.name = 'p5.png';
    this.branchType.caption = 'Men';
    this.setSrc(this.branchType,5);
  }

  submitCase(){
    this.submitEnable = true;
    this.submitButtonText = 'Submitting';
    this.route  = 'create-new-case';
    const token    = localStorage.getItem('userToken');
    this.newProjectObject['token'] = token;

    // setTimeout(() => this.saveImage(), 2000);
     this.saveImage();
// console.log(this.newProjectObject);
    setTimeout(() => this._service.postRequestCreator(this.newProjectObject, this.route, token).subscribe((response: any) => {

      // console.log(response);
    if(response.status == 204) {
      this.router.navigate(['login']);
    }

      if(response.status == 'success'){
        this.resetCreateForm();
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
      this.router.navigate(['cases']);
      this.goToTop();
      this.submitButtonText = 'Finish & Submit';
      this.submitEnable = false;
    })
  , 3000);
  }

  goToTop()
  {
    window.scrollTo(0, 0);
  }

  saveImage()
  {

    html2canvas(document.getElementById("iframe")).then(canvas => {
      var imageData = canvas.toDataURL("image/png");
      this.newProjectObject['imageData'] = imageData;
      // console.log('saveImage',this.newProjectObject);
    });
    // .catch(function (error) {
    //   console.log('saveImage_error',error);
    // });
  }


}
