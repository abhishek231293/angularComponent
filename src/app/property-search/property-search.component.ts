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
  selector: 'app-property-search',
  templateUrl: './property-search.component.html',
  styleUrls: ['./property-search.component.css']
})
export class PropertySearchComponent implements OnInit {

    searchPropertyForm: FormGroup;

    disabled = false;
    ShowFilter = true;
    limitSelection = false;
    vendors;
    caseNo = '';
    route:string;
    branchName:string;
    icon:string;
    user_id = '';
    projects;
    branchDetail:any;
    task_assignment_id = '';
    project_id = '';
    selectedItems =[];
    dropdownSettings: any = {};

    lat: number = 0;
    lng: number = 0;
    zoom = 5;
    markerStatus = true;

    submitted =false;

  constructor( private formBuilder: FormBuilder,
               private activeroute: ActivatedRoute,private router: Router,
               private _service: CommonService,private spinner: NgxSpinnerService) { }


  ngOnInit() {

      this.spinner.show();
      this.branchDetail = [{
          "code":'NA',
          "name":'NA'
      }];
      this.activeroute.queryParams.subscribe(params => {
          this.project_id = params['project_id'];
          this.task_assignment_id = params['task_assignment_id'];
      });

      const userData = JSON.parse(localStorage.getItem('userData'));

      const list = document.getElementsByClassName('dropdown-list');
      const dropdownBtn = document.getElementsByClassName('dropdown-btn');
      list[0].setAttribute('style', 'position: inherit;');
      dropdownBtn[0].setAttribute('style', 'border-color: #d2d6de; border-radius: inherit;');

      this.searchPropertyForm = this.formBuilder.group({
          asset_type: ['', Validators.required],
          asset_size: ['', [Validators.required,Validators.pattern(/^[.\d]+$/)]],
          price_range: ['', [Validators.required,Validators.pattern(/^[.\d]+$/)]],
          street_width: ['', [Validators.required,Validators.pattern(/^[.\d]+$/)]],
          deadline: ['', Validators.required],
          other_details: [''],
          vendor: ['', Validators.required],
      });

      this.getVendorList();
      this.getProjects();

      this.dropdownSettings = {
          singleSelection: false,
          idField: 'item_id',
          textField: 'item_text',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 3,
          allowSearchFilter: this.ShowFilter
      };

      this.selectedItems = [{ item_id: 4, item_text: 'Vendor 4' }, { item_id: 6, item_text: 'Vendor 6' }];

     /* this.myForm = this.fb.group({
          city: [this.selectedItems]
      });*/
      setTimeout(()=>{
          this.spinner.hide();
      }, 2000);
  }
    getProjects(){
        this.route     = 'project-list';
        let data       = {'project_id':this.project_id};
        const token    = localStorage.getItem('userToken');
        this._service.postRequestCreator(data, this.route, token).subscribe((response: any) => {
            if(response.status == 'success'){
                this.projects = response.result;
                if(this.projects){
                    this.caseNo = this.projects[0]['case_no'];
                    this.getBranchLocation(this.projects[0]['branch_code']);
                }

            }
        });
    }

    getBranchLocation(branchCode){
        this.route  = 'get-branch-location';
        const token    = localStorage.getItem('userToken');

        this._service.postRequestCreator({branch_code:branchCode}, this.route, token).subscribe((response: any) => {
            if(response[0]['latitude'] && response[0]['longitude']){
                    this.lat = parseFloat(response[0]['latitude']);
                    this.lng = parseFloat(response[0]['longitude']);
            }
            this.branchDetail = response;
            this.icon = '/../../assets/img/inprogress.png';
        });
    }

    resetEvaluationForm(){
        this.searchPropertyForm.reset();
    }
    onItemSelect(item: any) {
        console.log('onItemSelect', item);
    }
    onSelectAll(items: any) {
        console.log('onSelectAll', items);
    }
    /*toogleShowFilter() {
        this.ShowFilter = !this.ShowFilter;
        this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
    }*/

    handleLimitSelection() {
        if (this.limitSelection) {
            this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
        } else {
            this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
        }
    }

    getVendorList(){
        this.route  = 'get-vendor-list';
        const token    = localStorage.getItem('userToken');

        this._service.postRequestCreator({type:1}, this.route, token).subscribe((response: any) => {
            this.vendors = response;

            console.log(this.vendors);
        });
    }

      searchPropertySubmit(){

          this.spinner.show();
          this.submitted = true;

          // if(!this.validateForm()){
          //     this.spinner.hide();
          //     return;
          // }
          if(this.searchPropertyForm.status == 'INVALID') {
              this.spinner.hide();
          }else {

              this.route = 'property-search-response';
              const token = localStorage.getItem('userToken');

              var selectedDate = this.searchPropertyForm.value['deadline'];
              selectedDate = new Date(selectedDate);

              if (selectedDate.toDateString() === 'Invalid Date'){
                  selectedDate = this.searchPropertyForm.value['deadline'];
              }else{
                  selectedDate = selectedDate.toLocaleDateString();
                  selectedDate = selectedDate.split("/").reverse().join("-");
              }
              
              this.searchPropertyForm.value['deadline'] = selectedDate;
              this.searchPropertyForm.value['task_assignment_id'] = this.task_assignment_id;
              this.searchPropertyForm.value['project_id'] = this.project_id;
              this.searchPropertyForm.value['project_reference'] = this.caseNo;

              this._service.postRequestCreator(this.searchPropertyForm.value, this.route, token).subscribe((response:any) => {

                  this.submitted = false;
                  this.spinner.hide();

                  if (response.status == 204) {
                      this.router.navigate(['login']);
                  }
                  if (response.status == 200) {
                      this.resetEvaluationForm();
                      swal("Success", 'Successfully Submitted', 'success');
                  }

                  if (response.status == 409) {
                      swal("Error..!", 'Something went wrong! Please try again.', 'warning');
                  }

                  if (response.status == 401) {
                      this.resetEvaluationForm();
                      swal("Error..!", 'You are not authorize to submit this request', 'warning');
                  }

              });
          }
      }

    validateForm(){

        var dataToreturn = true;
        var field = '';

        for (const key of Object.keys(this.searchPropertyForm.controls)) {
            if(key == 'other_details'){
                continue;
            }
            var value = this.searchPropertyForm.value[key];

                if(!value || value == '' || value == null){
                    dataToreturn = false;
                    this.searchPropertyForm.controls[key].errors['required'] = true;
                }else{
                    switch (key) {
                        case 'asset_size' :
                        {
                            if (isNaN(value)) {
                                dataToreturn = false;
                                console.log(this.searchPropertyForm.controls[key]);
                                this.searchPropertyForm.controls[key].errors['required'] = true;
                            }
                        }
                        break;

                        case 'price_range' :
                        {
                            if (isNaN(value)) {
                                dataToreturn = false;
                                this.searchPropertyForm.controls[key].errors['required'] = true;
                            }
                        }
                            break;

                        case 'street_width' :
                        {
                            if (isNaN(value)) {
                                dataToreturn = false;
                                this.searchPropertyForm.controls[key].errors['required'] = true;
                            }
                        }
                            break;
                    }
                }
        }
        console.log(this.searchPropertyForm);
        return dataToreturn;
    }

    goBack(){
        this.spinner.show();
        const userData = JSON.parse(localStorage.getItem('userData'));
        if(userData.role === 'userA'){
            this.router.navigate(['create-case']);
        }else{
            this.router.navigate(['my-task']);
        }
        this.spinner.hide();
    }

}
