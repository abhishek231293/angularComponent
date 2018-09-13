import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, CommonService } from '../_services';
import { FormBuilder, FormControl ,FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import * as $ from 'jquery';
import {getProjectDetails} from "@angular/cli/utilities/project";
import {environment} from '../../environments/environment';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { UiSwitchModule } from 'ngx-toggle-switch';
@Component({
  selector: 'app-vendor-panel',
  templateUrl: './vendor-panel.component.html',
  styleUrls: ['./vendor-panel.component.css']
})
export class VendorPanelComponent implements OnInit {

  editUserForm: FormGroup;
  public result;
  route:string;
  isEditBranchError =  false;
  loading = false;
  submitted = false;
  returnUrl: string;
  isDisabled = '';
  code = '';
  types = [];

  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private _service: CommonService,
      private spinner: NgxSpinnerService,
      private alertService: AlertService) {}

  ngOnInit() {
    let userId = localStorage.getItem("editUserId");
    let isDisabledVal = localStorage.getItem("isDisabledUser");
    this.isDisabled = isDisabledVal;

    // this.isDisabled = isDisabledVal;
    if(!userId) {
      this.router.navigate(['vendor-management']);
    }

    this.getTypeList();

    this.editUserForm = this.formBuilder.group({
      id:[],
      name: ['', Validators.required],
      email: ['', Validators.required],
      type_id: ['', Validators.required],
      // password: ['', Validators.required],
      is_active: ['', Validators.required],
    });

    this.route  = 'vendor-details';
    let data = {
      id: userId
    };

    const userData = JSON.parse(localStorage.getItem('userData'));

    // console.log(data);

    this.loading = true;
    const token    = localStorage.getItem('userToken');
    this.spinner.show();
    this._service.postRequestCreator(data, this.route, token).subscribe((result: any) => {
      // this._service.getBranchDetailById(data, this.route, token).subscribe((result: any) => {

      this.loading = false;
      // console.log(this.result);
      if(isDisabledVal == 'true'){
        this.editUserForm.disable();
      }else{
        this.editUserForm.enable();
      }

      const userData = JSON.parse(localStorage.getItem('userData'));

      this.editUserForm.get('type_id').disable();

      console.log(result);

      // this.editUserForm.setValue(result);
      this.editUserForm.controls['id'].setValue(result.id);
      this.editUserForm.controls['name'].setValue(result.name);
      this.editUserForm.controls['email'].setValue(result.email);
      this.editUserForm.controls['type_id'].setValue(result.type_id);
      // this.editUserForm.controls['password'].setValue(result.password);
      this.editUserForm.controls['is_active'].setValue(result.is_active);
      this.spinner.hide();
    });
    this.spinner.hide();

  }

  getTypeList(){

    this.route  = 'vendor-type';
    const token    = localStorage.getItem('userToken');
    // this.spinner.show();
    this._service.postRequestCreator({}, this.route, token).subscribe((result: any) => {
      this.types = result;
    });

  }

  updateUser() {
    // console.log(this.editUserForm.value);
    let msg = '';
    if(this.editUserForm.value['name']==''){
      msg = 'Please Enter Name';
    }if(this.editUserForm.value['department_id']==''){
      msg = 'Please Select Department';
    }if(this.editUserForm.value['role_id']==''){
      msg = 'Please Select Role';
    }/*if(this.editUserForm.value['password']==''){
     msg = 'Please Enter Password';
     }*/
    if(msg!=''){
      swal("Error..!", msg, 'warning');
      return;
    }
    const userEmail = localStorage.getItem("editUserEmail");
    swal({
      title: 'Are you sure?',
      text: 'You want to update vendor details of '+userEmail,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#30d633',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.route  = 'update-vendor';
        const token = localStorage.getItem('userToken');

        this.spinner.show();
        if(this.editUserForm.value['is_active']==false){
          this.editUserForm.value['is_active'] = 0;
        }

        this._service.postRequestCreator(this.editUserForm.value, this.route, token).subscribe((result: any) => {
          this.loading = false;
          this.router.navigate(['vendor-management']);
          // this.router.navigate(['edit-utility']);
          this.spinner.hide();
        });
      }
    });
  }

  goToUserList(){
    this.spinner.show();
    this.router.navigate(['vendor-management']);
    this.spinner.hide();
  }

}
