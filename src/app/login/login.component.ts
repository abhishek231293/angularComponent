import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { Observable } from 'rxjs/Observable';
// import { Observable } from 'rxjs';
// import { Router } from '@angular/router';
import { FormBuilder, FormControl ,FormGroup, Validators } from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { first } from 'rxjs/operators';
// import {HttpErrorResponse} from '@angular/common/http';
// import {passwordMatchValidator} from '../validators/passwordmatch.validator';
// import swal from 'sweetalert2';
// import swal from 'sweetalert2';

import { AlertService, AuthenticationService } from '../_services';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public login = {'email': '', 'password' : ''};
    loginForm: FormGroup;
    public result;
    isLoginError =  false;
    loading = false;
    submitted = false;
    returnUrl: string;
    isLoader = false;
    action_from;
    projectId;
    mode;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private spinner: NgxSpinnerService,
        private alertService: AlertService) {}

    ngOnInit() {
        // this.spinner.show();
     this.loginForm = this.formBuilder.group({
                'name': new FormControl('', [Validators.required]),
                'password': new FormControl('', [Validators.required])
            });
        const token    = localStorage.getItem('userToken');
        this.route.queryParams.subscribe(params => {
                if(params['action_from'] !== 'undefined') {
                    this.action_from = params['action_from'];
                }
                if(params['projectId'] !== 'undefined') {
                    this.projectId = params['projectId'];
                }
                if(params['mode'] !== 'undefined') {
                    this.mode = params['mode'];
                }
            });

        if(!token){
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            this.router.navigate(['login']);
            // this.loginForm = this.formBuilder.group({
            //     'name': new FormControl('', [Validators.required]),
            //     'password': new FormControl('', [Validators.required])
            // });
        }else{
            const userData = JSON.parse(localStorage.getItem('userData'));
            // console.log(userData);
            // this.user_name     = userData.hasOwnProperty('first_name') ?  (userData.first_name+' '+userData.last_name) : 'Guest';
           /* if(userData.role_id =='userB'){
                //this.router.navigate(['cases']);
                this.router.navigate(['activities']);
            }else if(userData.role =='userA'){
                //this.router.navigate(['create-case']);
                this.router.navigate(['activities']);
            }*/

                this.router.navigate(['activities']);
            // return true;
        }

        // setTimeout(() => {
            /** spinner ends after 5 seconds */
            // this.spinner.hide();
        // }, 500);


        // reset login status
        // this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    loginUser() {
        const token    = localStorage.getItem('userToken');
        this.isLoader = true;
        if(token){
           const userData = JSON.parse(localStorage.getItem('userData'));
            // console.log(userData);
            // this.user_name     = userData.hasOwnProperty('first_name') ?  (userData.first_name+' '+userData.last_name) : 'Guest';
            return true;
                // console.log('hdds');
        }
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            this.isLoader = false;
            return;
        }

        this.loading = true;
        this.spinner.show();
        // this.authenticationService.login(this.f.name.value, this.f.password.value)
        this.authenticationService.userLogin(this.loginForm.value).subscribe((data: any) => {
                // console.log(data.message);
                if(data.message == 'unverified'){
                    // this.verifyUserAccount(data.email);
                }else{
                    localStorage.setItem('userToken', data.token);
                    this.authenticationService.getUserData(data).subscribe((userData: any) => {
                        // console.log(userData);
                        const userDataJSON = JSON.stringify(userData.result);
                        // console.log(userData.result['role']);
                        localStorage.setItem('userData', userDataJSON);
                       /* if(userData.result['role']=='userB'){
                            //this.router.navigate(['cases']);
                            this.router.navigate(['activities']);
                        }else if(userData.result['role']=='userA'){
                            //this.router.navigate(['create-case']);
                            this.router.navigate(['activities']);

                        }*/
                        if(this.action_from === 'mail'){
                            this.router.navigate(['/edit-case'],{ queryParams: { projectid: this.projectId, mode:this.mode}});
                        }else{
                            this.router.navigate(['activities']);
                        }
                        this.spinner.hide();
                        // this.isLoader = false;
                    });

                    /*this.authenticationService.getBranches(data).subscribe((userData: any) => {
                        const myJSON = JSON.stringify(userData.result);
                        // console.log(myJSON);
                        localStorage.setItem('userData', myJSON);
                        // this.router.navigate(['branch']);
                        this.router.navigate(['home']);
                        // this.router.navigate([this.returnUrl]);
                        this.loading = false;
                    });*/
                }
                // this.isLoader = false;
                // this.router.navigate([''], { queryParams: { token: data.token } });
            },
            (error: HttpErrorResponse) => {
                /*this.loading = true;
                this.isLoginError = true;*/
                // this.alertService.error(error);
                this.isLoginError = true;
                this.isLoader = false;
                this.loading = false;
            }
        );


        /*this.authenticationService.login(this.loginForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });*/
    }
}
