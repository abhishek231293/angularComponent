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
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {
  activeOption:string = 'selectType';
  activeOptionCss:any;
  projectId;
  taskAssignmentId;
  vendorId;
  route;

  vendor = {
    'other':{
      'caseNo' : '',
      'projectId': '',
      'taskAssignmentId':'',
      'vendorId':''
    },
    'info' : {
      'ownerName'       : '',
      'numberOfStreets' : '',
      'numberOfparcels' : '',
      'buildingOnLand'  : '',
      'agentName'       : '',
      'plotSize'        : '',
      'plotNumber'      : '',
      'masterplan'      : '',
      'deedsNumber'      : '',
      'availability'    : {
        'water' : false,
        'electricity' : false,
        'phone'   : false,
        'sewage' : false
      }
    },
    'asset' : {
      'north' : {
        'sideLength' : '',
        'borders'    : ''
      },
      'south' : {
        'sideLength' : '',
        'borders'    : ''
      },
      'east' : {
        'sideLength' : '',
        'borders'    : ''
      },
      'west' : {
        'sideLength' : '',
        'borders'    : ''
      },
      'cost' : '',
      'commisionRate' : '',
      'price' : ''
    },
    'doc' : {
      'drawings' : '',
      'streetView' : '',
      'satellite' : '',
      'regionScheme' : '',
      'deedCopy' : '',
      'sellerOffer' : '',
    }
  };

  constructor( private fb: FormBuilder,
               private activeroute: ActivatedRoute,private router: Router,
               private _service: CommonService,private spinner: NgxSpinnerService) { }


  ngOnInit() {

    this.spinner.show();

    this.activeroute.queryParams.subscribe(params => {
      this.projectId = params['project_id'];
      this.taskAssignmentId = params['task_id'];
      this.vendorId = params['vendor_id'];

      this.vendor.other.projectId = this.projectId;
      this.vendor.other.taskAssignmentId = this.taskAssignmentId;
      this.vendor.other.vendorId = this.vendorId;

    });

    setTimeout(() => {
      this.spinner.hide();
    }, 1000);

    this.activeOption = 'purpose';
    this.createForm();
    this.activeOptionCss = [0,0,0];
  }

  submitVendor(validationFor:string){

    this.spinner.show();
    let error = false;
    for (const key of Object.keys(this.form.value)) {
      if(!this.form.value[key]){
        if(key != 'satellite' && key != 'regionScheme' && key != 'name'){
          error = true;
        }
        this.vendor[validationFor][key] = '';
      }else{
        this.vendor[validationFor][key] = this.form.value[key];
      }
    }

    if(!this.form.value.streetView1 || !this.form.value.streetView2 || !this.form.value.streetView3){
      this.vendor[validationFor]['streetView'] = '';
    }else{
      this.vendor[validationFor]['streetView'] = '1';
    }

    if(error){
      setTimeout(()=>{
        this.spinner.hide();
      }, 1000);
      return;
    }

    this.route  = 'task-property-search-vendor-response';
    // const token    = localStorage.getItem('userToken');

    // return;

    console.log('-----------------');
    console.log(this.vendor);
    console.log('-----------------');

    this._service.postRequestNoTokenCreator(this.vendor, this.route).subscribe((response: any) => {

      setTimeout(()=>{
        this.spinner.hide();
      }, 1000);

      if(response.status == 'success'){
        swal("Success", 'Successfully Recorded', 'success');
        setTimeout(()=>{
          window.location.reload();
        }, 2000);

      }
    });

  }

  resetFiles(){
    for (const key of Object.keys(this.form.value)) {
      this.form.value[key] = null;
    }
    this.vendor['doc']['streetView'] = '1';
  }

  form: FormGroup;
  createForm() {
    this.form = this.fb.group(
        {
          name: ['', Validators.required],
          drawings: null,
          streetView1: null,
          streetView2: null,
          streetView3: null,
          satellite: null,
          regionScheme: null,
          deedCopy: null,
          sellerOffer: null
        }
    );

  }

  onFileChange(event, type) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get(type).setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1],
          file:file
        })
      };
    }
  }


  goToNextOption(nextOption:string, validationFor:string){
    if (!nextOption){
      return;
    }
    
    if(!this.validateForm(validationFor)){
      return;
    }
    if(nextOption=='property'){
      this.activeOptionCss[1] = 0;
    }
    if(nextOption=='siteProfile'){
      alert("fff");
      this.activeOptionCss[1] = 1;
      this.activeOptionCss[2] = 0;
    }
    if(nextOption=='branchType'){
      this.activeOptionCss[1] = 1;
      this.activeOptionCss[2] = 1;
      this.activeOptionCss[3] = 0;
    }    
    this.activeOption = nextOption;
  }

  validateForm(validationFor) {

    var dataToreturn = true;
    var field = '';

    for (const key of Object.keys(this.vendor[validationFor])) {
      var value = this.vendor[validationFor][key];
      
      if (dataToreturn) {

        var message = '';

        if (!value) {
          console.log('here');
          field = key;
          message = 'This field is required.'
          dataToreturn = false;

        } else if (key) {

          switch (key) {
            case 'numberOfStreets' :
            {
              if (isNaN(value)) {
                field = key;
                message = 'Please provide a valid number of streets.';
                dataToreturn = false;
                this.vendor[validationFor][key] = '';
              }
            }
              break;

            case 'numberOfparcels' :
            {
              if (isNaN(value)) {
                field = key;
                message = 'Please provide a valid number of parcels.';
                dataToreturn = false;
                this.vendor[validationFor][key] = '';
              }
            }
              break;
            default :

          }

        }
      }
    }
    //console.log(dataToreturn);
    return dataToreturn;
  }


}
