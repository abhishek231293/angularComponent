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
  selector: 'app-property-valuation',
  templateUrl: './property-valuation.component.html',
  styleUrls: ['./property-valuation.component.css']
})
export class PropertyValuationComponent implements OnInit {

    valuationPropertyForm: FormGroup;

    disabled = false;
    vendors = [];
    caseNo = '';
    ShowFilter = true;
    route = '';
    limitSelection = false;
    projects;
    selectedItems =[];
    dropdownSettings: any = {};
    taskAssignmentId;
    userId;
    projectId;
    uploadFile1:FileList;
    uploadFile2:FileList;
    uploadFile3:FileList;

    submitted = false;

    constructor( private formBuilder: FormBuilder,
                 private activeroute: ActivatedRoute,private router: Router,
                 private _service: CommonService,private spinner: NgxSpinnerService) { }

    ngOnInit() {

        this.spinner.show();

        this.getVendorList();
        // $('.dropify').dropify();
        const dragAndDrop = $('.dropify').dropify({
            messages: {
                'default': 'Drag and drop a file here or click'
            }
        });

        this.activeroute.queryParams.subscribe(params => {

            this.projectId = params['project_id'];
            this.taskAssignmentId = params['task_assignment_id'];

        })
        // console.log(dragAndDrop);
        // $('.dropify').dropify({});

        const list = document.getElementsByClassName('dropdown-list');
        const dropdownBtn = document.getElementsByClassName('dropdown-btn');
        list[0].setAttribute('style', 'position: inherit;')
        dropdownBtn[0].setAttribute('style', 'border-color: #d2d6de; border-radius: inherit;')
        // list[0].style.position = 'inherit';
        // console.log(list);

        this.valuationPropertyForm = this.formBuilder.group({
            asset_type: ['', Validators.required],
            asset_size: ['', [Validators.required,Validators.pattern(/^[.\d]+$/)]],
            street_width: ['', [Validators.required,Validators.pattern(/^[.\d]+$/)]],
            deadline: ['', Validators.required],
            other_details: ['', Validators.required],
            vendor: ['', Validators.required],
            image_upload1: ['', Validators.required],
            image_upload2: [''],
            image_upload3: ['']
        });

        this.getProjects();

        this.selectedItems = [{ item_id: 4, item_text: 'Vendor 4' }, { item_id: 6, item_text: 'Vendor 6' }];
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: this.ShowFilter
        };

        setTimeout(()=>{
            this.spinner.hide();
        }, 2000);
        /* this.myForm = this.fb.group({
             city: [this.selectedItems]
         });*/
    }
    onItemSelect(item: any) {
        console.log('onItemSelect', item);
    }
    onSelectAll(items: any) {
        console.log('onSelectAll', items);
    }

    getProjects(){
        this.route     = 'project-list';
        let data       = {'project_id':this.projectId};
        const token    = localStorage.getItem('userToken');
        this._service.postRequestCreator(data, this.route, token).subscribe((response: any) => {
            if(response.status == 'success'){
                this.projects = response.result;
                if(this.projects){
                    this.caseNo = this.projects[0]['case_no'];
                }

            }
        });
    }
    /*toogleShowFilter() {
        this.ShowFilter = !this.ShowFilter;
        this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
    }*/

    getVendorList(){
        this.route  = 'get-vendor-list';
        const token    = localStorage.getItem('userToken');

        this._service.postRequestCreator({type:2}, this.route, token).subscribe((response: any) => {
            this.vendors = response;
        });
    }

    handleLimitSelection() {
        if (this.limitSelection) {
            this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
        } else {
            this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
        }
    }

    valuationPropertySubmit(){
        this.spinner.show();
        this.submitted = true;

        if(this.valuationPropertyForm.status == 'INVALID'){
            this.spinner.hide();
        }else{
            // return;
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
            
            formData.append('asset_type',this.valuationPropertyForm.value['asset_type']);
            formData.append('asset_size',this.valuationPropertyForm.value['asset_size']);
            formData.append('street_width',this.valuationPropertyForm.value['street_width']);
            formData.append('project_reference',this.caseNo);

            var selectedDate = this.valuationPropertyForm.value['deadline'];
            selectedDate = new Date(selectedDate);

            if (selectedDate.toDateString() === 'Invalid Date'){
                selectedDate = this.valuationPropertyForm.value['deadline'];
            }else{
                selectedDate = selectedDate.toLocaleDateString();
                selectedDate = selectedDate.split("/").reverse().join("-");
            }

            formData.append('deadline',selectedDate);
            formData.append('other_details',this.valuationPropertyForm.value['other_details']);
            formData.append('vendor',JSON.stringify(this.valuationPropertyForm.value['vendor']));

            formData.append('project_id',this.projectId);
            formData.append('task_assignment_id',this.taskAssignmentId);

            this.route = 'submit-property-valuation';

            const token    = localStorage.getItem('userToken');
            this._service.postRequestCreator(formData, this.route, token).subscribe((response: any) => {

                this.submitted = false;
                setTimeout(()=>{    //<<<---    using ()=> syntax
                    this.spinner.hide();
                }, 1000);

                if(response.status == 204) {
                    this.router.navigate(['login']);
                }
                if(response.status == 200){
                    swal("Success", 'Property valuation successful', 'success');
                    this.resetEvaluationForm();
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

    resetEvaluationForm(){

        this.valuationPropertyForm.reset();
        $('.dropify-clear').trigger('click');

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


    goBack(){
        this.spinner.show();
        const userData = JSON.parse(localStorage.getItem('userData'));
        if(userData.role === 'userA'){
            this.router.navigate(['create-case']);
        } else {
            this.router.navigate(['task']);
        }
        this.spinner.hide();
    }

}
