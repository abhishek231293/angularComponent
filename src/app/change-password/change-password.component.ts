import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, CommonService } from '../_services';
import { FormBuilder, FormControl ,FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../environments/environment';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { UiSwitchModule } from 'ngx-toggle-switch';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

    updatePasswordForm: FormGroup;
    public result;
    route:string;
    isEditBranchError =  false;
    loading = false;
    submitted = false;
    passwordMismatch = false;
    currentPasswordMismatch = false;
    newPasswordSame = false;
    returnUrl: string;
    isDisabled = '';
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
        this.updatePasswordForm = this.formBuilder.group({
            current_password: ['', Validators.required],
            new_password: ['',[ Validators.required, Validators.minLength(8)]],
            confirm_password: ['', Validators.required]
        });

    }

    get f() { return this.updatePasswordForm.controls; }

    updatePassword() {
        /*let msg = '';
        if(this.updatePasswordForm.value['current_password']==''){
            msg = 'Please Enter Current Password';
        }
        if(this.updatePasswordForm.value['new_password']==''){
            msg = 'Please Enter New Password';
        }
        if(this.updatePasswordForm.value['confirm_password']==''){
            msg = 'Please Enter Confirm Password';
        }

        if(this.updatePasswordForm.value['confirm_password'] !== this.updatePasswordForm.value['new_password']){
             // "Password are not matching, please enter new and confirm password same!";
            this.passwordMismatch = true;
        }

        if(msg!=''){
            swal("Error..!", msg, 'warning');
            return;
        }*/
        this.submitted = true;

        if (this.updatePasswordForm.invalid) {
            return;
        }

        swal({
            title: 'Are you sure?',
            text: 'You want to update password!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#30d633',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                this.currentPasswordMismatch = false;
                this.newPasswordSame = false;
                // console.log(result.value);
                this.spinner.show();
                if(this.updatePasswordForm.value['confirm_password'] !== this.updatePasswordForm.value['new_password']){
                    // "Password are not matching, please enter new and confirm password same!";
                    this.passwordMismatch = true;
                    this.router.navigate(['change-password']);
                    this.spinner.hide();
                } else {
                    this.route  = 'change-password';
                    const token    = localStorage.getItem('userToken');
                    this._service.postRequestCreator(this.updatePasswordForm.value, this.route, token).subscribe((result: any) => {
                      console.log(result);
                        this.loading = false;
                        if(result.message === 'current_password_mismatch'){
                            this.currentPasswordMismatch = true;
                            this.newPasswordSame = false;
                            this.router.navigate(['change-password']);
                            this.spinner.hide();
                        } else if(result.message === 'new_password_same'){
                            this.newPasswordSame = true;
                            this.currentPasswordMismatch = false;
                            this.router.navigate(['change-password']);
                            this.spinner.hide();
                        } else {
                            swal(
                                'Success',
                                'You have successfully updated the password',
                                'success'
                            )
                            const userData = JSON.parse(localStorage.getItem('userData'));
                            if(userData.role === 'userA'){
                                this.router.navigate(['create-case']);
                            } else {
                                this.router.navigate(['task']);
                            }
                            this.spinner.hide();
                        }
                    });
                }

            }
        });
    }

    goBack(){
        this.spinner.show();
        const userData = JSON.parse(localStorage.getItem('userData'));
        if(userData.role === 'userA'){
            this.router.navigate(['create-case']);
        }else{
            this.router.navigate(['task']);
        }
        this.spinner.hide();
    }

    /*focusOutFunction(){
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
    }*/

}
