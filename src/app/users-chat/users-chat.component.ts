import { ViewChild, ElementRef, Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import { Router } from '@angular/router';
import {CommonService} from '../_services';
import {NgxSpinnerService} from 'ngx-spinner';
import { FormBuilder, FormControl , FormGroup, Validators } from '@angular/forms';
import {Observable} from 'rxjs/Rx';
import {NgxAutoScroll} from 'ngx-auto-scroll';


@Component({
  selector: 'app-users-chat',
  templateUrl: './users-chat.component.html',
  styleUrls: ['./users-chat.component.css']
})
export class UsersChatComponent implements OnInit {

    @ViewChild(NgxAutoScroll) ngxAutoScroll: NgxAutoScroll;

    API_BASE_URL = environment.apiBaseUrl;
    public result;
    route: string;
    chat_route: string;
    submitted = false;
    chatDataForm: FormGroup;
    chatData = [];
    isLoader = false;
    userId = '';
  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private _service: CommonService,
      private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {

      this.chatDataForm = this.formBuilder.group({
          chat_data: ['', Validators.required]
      });

      this.getChatData();

      const userData = JSON.parse(localStorage.getItem('userData'));

      this.userId = userData.id;

      Observable.interval(30000).subscribe(x => { // will execute every 30 seconds
          this.getChatData();
      });

  }

    get f() { return this.chatDataForm.controls; }

    updateChatData(){

        this.submitted = true;

        if (this.chatDataForm.invalid) {
            return;
        }

        // console.log(this.chatDataForm.value);
        // console.log('hi');

        const token  = localStorage.getItem('userToken');

        this.chat_route  = 'store-chat';
        this.isLoader = true;

        this._service.postRequestCreator(this.chatDataForm.value, this.chat_route, token).subscribe((result: any) => {
            // console.log( this.chatDataForm.value.chat_data);
            const userData = JSON.parse(localStorage.getItem('userData'));

            this.userId = userData.id;
            // this.chatData = result;
            //console.log(userData);
            //console.log(this.chatData);
            this.chatData.push({ chat_text: this.chatDataForm.value.chat_data, user_image : userData.user_image, name : userData.name, user_id : userData.id});
            //console.log(this.chatData);
            // this.getChatData();
            this.chatDataForm = this.formBuilder.group({
                chat_data: ['', Validators.required]
            });
            this.submitted = false;
            this.isLoader = false;

        });

    }

    getChatData(){

        // this.submitted = true;
        this.submitted = false;

        this.route  = 'chat-log';
        let data = null;

        const token    = localStorage.getItem('userToken');

        data = {
            role_id: 1
        };

        this.isLoader = false;
        this.chatDataForm = this.formBuilder.group({
            chat_data: ['', Validators.required]
        });

        this._service.postRequestCreator(data, this.route, token).subscribe((result: any) => {
            // console.log(result);
            this.chatData = result;
            this.isLoader = false;
        });
    }

    public forceScrollDown(): void {
        this.ngxAutoScroll.forceScrollDown();
    }

}
