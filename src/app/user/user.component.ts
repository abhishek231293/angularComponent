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
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

    editUserForm: FormGroup;
    public result;
    route:string;
    isEditBranchError =  false;
    loading = false;
    submitted = false;
    returnUrl: string;
    isDisabled = '';
    code = '';
    roles = [];
    departments = [];

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
            this.router.navigate(['user-management']);
        }
        this.editUserForm = this.formBuilder.group({
            id:[],
            name: ['', Validators.required],
            email: ['', Validators.required],
            department_id: ['', Validators.required],
            role_id: ['', Validators.required],
            // password: ['', Validators.required],
            is_active: ['', Validators.required],
        });

        this.route  = 'user-details';
        let data = {
            id: userId
        };

        const token    = localStorage.getItem('userToken');

        const userData = JSON.parse(localStorage.getItem('userData'));

        this.spinner.show();

        let role_param = {
            id: userData.role_id
        };

        this._service.getRoleDetails(role_param,token).subscribe((data: any) => {
            this.roles = data;
            this.spinner.hide();
        });

        // console.log(this.roles);
        let dept_param = ''
        this.spinner.show();
        this._service.getDepartmentDetails(dept_param,token).subscribe((data: any) => {
            this.departments = data;
            this.spinner.hide();
        });



        this.loading = true;

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

            if (userData.role_id === 3) {
                this.editUserForm.get('department_id').disable();
            }
            if (userData.role_id === 4) {
                this.editUserForm.get('department_id').disable();
            }

            if (userData.role_id === 4) {
                this.editUserForm.get('role_id').disable();
            }


            // this.editUserForm.setValue(result);
            this.editUserForm.controls['id'].setValue(result.id);
            this.editUserForm.controls['name'].setValue(result.name);
            this.editUserForm.controls['email'].setValue(result.email);
            this.editUserForm.controls['department_id'].setValue(result.department_id);
            this.editUserForm.controls['role_id'].setValue(result.role_id);
            // this.editUserForm.controls['password'].setValue(result.password);
            this.editUserForm.controls['is_active'].setValue(result.is_active);
            this.spinner.hide();
        });
        this.spinner.hide();

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
            text: 'You want to update user details of '+userEmail,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#30d633',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                this.route  = 'update-user';
                const token = localStorage.getItem('userToken');

                this.spinner.show();
                if(this.editUserForm.value['is_active']==false){
                    this.editUserForm.value['is_active'] = 0;
                }

                this._service.postRequestCreator(this.editUserForm.value, this.route, token).subscribe((result: any) => {
                    this.loading = false;
                    this.router.navigate(['user-management']);
                    // this.router.navigate(['edit-utility']);
                    this.spinner.hide();
                });
            }
        });
    }

    goToUserList(){
        this.spinner.show();
        this.router.navigate(['user-management']);
        this.spinner.hide();
    }

}
