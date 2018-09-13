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
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

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
    url;
    fileToUpload: File = null;
    mailVerify;
    verifyMail;
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private _service: CommonService,
        private spinner: NgxSpinnerService,
        private alertService: AlertService) {}

    ngOnInit() {
        this.spinner.show();
        setTimeout(() => {
            this.spinner.hide();
        }, 1000);

        this.mailVerify=0;
        this.verifyMail='';
        this.editUserForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            department_id: ['', Validators.required],
            role_id: ['', Validators.required],
            password: ['', Validators.required],
            is_active: [true, Validators.required]
        });

        this.roles = [
            {id: 1, name: "Admin"},
            {id: 2, name: "Guest"},
            {id: 3, name: "Manager"},
            {id: 4, name: "Supervisor"},
            {id: 5, name: "Agent"}
        ];

        this.departments = [
            {id: 1, name: "ARB"},
            {id: 2, name: "RE/Projects"},
            {id: 3, name: "FM"}
        ];

        const userData = JSON.parse(localStorage.getItem('userData'));


        if (userData.role_id === 3) {
            this.roles = [
                {id: 4, name: "Supervisor"},
                {id: 5, name: "Agent"}
            ];

            if(userData.department_id === 1){
                this.departments = [
                    {id: 1, name: "ARB"}
                ];
            }
            if(userData.department_id === 2){
                this.departments = [
                    {id: 2, name: "RE/Projects"}
                ];
            }
            if(userData.department_id === 3){
                this.departments = [
                    {id: 3, name: "FM"}
                ];
            }
        }

        if (userData.role_id === 4) {
            this.roles = [
                {id: 5, name: "Agent"}
            ];
            if(userData.department_id === 1){
                this.departments = [
                    {id: 1, name: "ARB"}
                ];
            }
            if(userData.department_id === 2){
                this.departments = [
                    {id: 2, name: "RE/Projects"}
                ];
            }
            if(userData.department_id === 3){
                this.departments = [
                    {id: 3, name: "FM"}
                ];
            }
        }

       /* if (userData.role_id !== 1) {
            this.editUserForm.get('department_id').disable();
        }*/
        // console.log(data);
        this.url = '../assets/img/no_preview.png'
    }
    updateUser() {
        let msg = '';
        if(this.editUserForm.value['name']==''){
            msg = 'Please Enter Name';
        }if(this.editUserForm.value['department_id']==''){
            msg = 'Please Select Department';
        }if(this.editUserForm.value['role_id']==''){
            msg = 'Please Select Role';
        }if(this.editUserForm.value['email']==''){
            msg = 'Please Enter Email';
        }if(this.editUserForm.value['password']==''){
            msg = 'Please Enter Password';
        }if(this.mailVerify==1){
            msg = 'Email Already Exists';
        }
        if(this.editUserForm.controls.email.errors!=null){
            if(this.editUserForm.controls.email.errors.pattern){
                msg = 'Please Enter Valid Email';
            }

        }
        if(msg!=''){
            swal("Error..!", msg, 'warning');
            return;
        }

        if(this.fileToUpload!=undefined){
            if(this.fileToUpload['size'] > 2000000){
                swal("Error..!", 'File size must be less than 2 Mb', 'warning');
                return ;
            }
            var fileName = (this.fileToUpload['name'].replace(/^.*[\\\/]/, '')).split('.');
            var ext = fileName[1];
            var isValidLogo = $.inArray( ext, ['png','jpg','jpeg']);
            if(isValidLogo == '-1'){
                swal("Error..!", 'Please select a valid file', 'warning');
                return ;
            }
        }
        swal({
            title: 'Are you sure?',
            text: 'You want to add new user!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#30d633',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                this.route  = 'add-user';
                const token    = localStorage.getItem('userToken');
                this.spinner.show();
                this.editUserForm.value['is_active']?this.editUserForm.value['is_active']=1:this.editUserForm.value['is_active']=0;
                this._service.postRequestCreator(this.editUserForm.value, this.route, token).subscribe((result: any) => {
                    this.loading = false;
                    this.router.navigate(['user-management']);
                    // this.router.navigate(['edit-utility']);
                    if(this.fileToUpload!=undefined) {
                        this._service.postFile(this.fileToUpload, result.id, token).subscribe(data => {
                            // console.log(data);
                            // do something, if upload success
                        }, error => {
                            // console.log(error);
                        });
                    }
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
    onSelectFile(event) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();

            reader.readAsDataURL(event.target.files[0]); // read file as data url

            reader.onload = (event) => { // called once readAsDataURL is completed
                console.log(event.target);
                this.url = event.target['result'];
            }
            this.fileToUpload = event.target.files[0];
        }
    }
    focusOutFunction(){
        if (this.editUserForm.value['email']!=''){
            this.route      = 'check-mail';
            const token     = localStorage.getItem('userToken');
            this.spinner.show();
            let data = {
                "mail":this.editUserForm.value['email']
            }
            this._service.postRequestCreator(data, this.route, token).subscribe((result: any) => {
                if(result['mail_Exists']==0){
                    this.mailVerify=0;
                    this.verifyMail = "";
                }else if(result['mail_Exists']==1){
                    this.mailVerify=1;
                    this.verifyMail = "Email ID Already Exists";
                }
                // this.router.navigate(['edit-utility']);
                this.spinner.hide();
            });
        }else{
            this.mailVerify=0;
            this.verifyMail = "";
        }
    }
}
