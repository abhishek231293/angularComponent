import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../_services';
import { FormBuilder, FormControl ,FormGroup, Validators ,FormArray} from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-project-ref',
  templateUrl: './project-ref.component.html',
  styleUrls: ['./project-ref.component.css']
})
export class ProjectRefComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService,private activeroute: ActivatedRoute,
              private _service: CommonService,private router: Router,
              private formBuilder: FormBuilder) { }
  projectId = '';
  loader = false;
  route = '';
  taskDetail;
  projectDetails = [];
  assignUserList = [];
  taskAssignForm : FormGroup;
  formArray: FormArray;
  // tasks: any[] = [];
  tasks;
  formFields;
  task_name = '';
  taskPriority;
  userId;
  userDepartmentId;
  submitted = false;
  departmentId;
  disabledVal  = '';
  taskDate;
  taskAttribute;
  ngOnInit() {
    this.spinner.show();

    this.taskPriority = ["Low","High","Normal"];

    const userData = JSON.parse(localStorage.getItem('userData'));

    this.userId  = userData.id;
    this.userDepartmentId = userData.department_id;


    this.taskDetail = new FormArray([]);

    this.activeroute.queryParams.subscribe(params => {

      this.loader = true;
      this.projectId = params['projectid'];
      this.departmentId = 3;
      if(this.departmentId !== this.userDepartmentId){
        this.disabledVal = 'disabled';
      }
      this.getTaskDetail(this.projectId,this.departmentId);

      this.taskAssignForm = this.formBuilder.group({

        tasks: this.taskDetail
      });

      setTimeout(()=>{
        this.spinner.hide();
      }, 1000);

    })


  }

  getSampleArrayControls() {
    // console.log(this.taskAssignForm.get('tasks'));
    return  ( < FormArray > this.taskAssignForm.get('tasks')).controls ;
  }

  getTaskDetail(id,departmentId){
    // this.departmentId = departmentId;
    if(departmentId !== this.userDepartmentId){
      this.disabledVal = 'disabled';
    }
    this.route  = 'task-detail';
    let data = {
      'project_id':id,
      'department_id': departmentId
    };
    const token    = localStorage.getItem('userToken');
    this.spinner.show();

    this._service.postRequestCreator(data, this.route, token).subscribe((result: any) => {

        this.assignUser();

        this.taskDetail = result.result;

      // this.tasks = '';
     console.log(this.taskDetail);
      const userData = JSON.parse(localStorage.getItem('userData'));

      if(userData.role_id === 1){
        this.projectDetails= result.result;
        // console.log(this.tasks);
        //console.log('hi');
        //console.log(this.taskDetail.length);
        ( < FormArray > this.taskAssignForm.get('tasks')).controls = [];
        this.tasks = this.taskAssignForm.get('tasks') as FormArray;
        for(var i=0; i< this.taskDetail.length; i++){
          this.tasks = this.taskAssignForm.get('tasks') as FormArray;
          this.tasks.push(this.createItem(this.taskDetail[i]));
        }
      } else if(this.taskDetail[0].approve_status === 'accepted' || userData.role_id !== 1){
        this.projectDetails= result.result;

        ( < FormArray > this.taskAssignForm.get('tasks')).controls = [];
        this.tasks = this.taskAssignForm.get('tasks') as FormArray;
        for(var i=0; i< this.taskDetail.length; i++){
          this.tasks = this.taskAssignForm.get('tasks') as FormArray;
          this.tasks.push(this.createItem(this.taskDetail[i]));
        }
        // this.taskAssignForm.disable();
        console.log(this.tasks);
        setTimeout(()=>{
          this.spinner.hide();
        }, 1000);

      }else{
        swal({
          type: 'error',
          title: '',
          text: 'You are not authorized to access task detail!'
        })
        setTimeout(()=>{
          this.spinner.hide();
        }, 1000);
        this.router.navigate(['/cases'])
      }


    });

  }

      createItem(taskDetails): FormGroup {
      return this.formBuilder.group({
        fk_task_id: taskDetails.task_id ? taskDetails.task_id : '',
        fk_project_id: this.projectId,
        fk_user_id: [{value: taskDetails.fk_user_id ? taskDetails.fk_user_id : '',
          disabled: taskDetails.fk_user_id ? true : (taskDetails.fk_department_id !== this.userDepartmentId) ? true:false}, Validators.required ],
        task_duration_to: [{value: taskDetails.task_duration_to ? taskDetails.task_duration_to.split("-").reverse().join("-") : '',
          disabled: taskDetails.task_duration_to ? true : (taskDetails.fk_department_id !== this.userDepartmentId) ? true:false}, Validators.required],
        task_duration_from: [{value:taskDetails.task_duration_from ? taskDetails.task_duration_from.split("-").reverse().join("-") : '',
          disabled: taskDetails.task_duration_from ? true : (taskDetails.fk_department_id !== this.userDepartmentId) ? true:false}, Validators.required],
        priority: [{value:taskDetails.priority ? taskDetails.priority : '',
          disabled: taskDetails.priority ? true : (taskDetails.fk_department_id !== this.userDepartmentId) ? true:false},Validators.required],
        is_assign: taskDetails.is_assign ? taskDetails.is_assign : '',
        fk_department_id: taskDetails.fk_department_id ? taskDetails.fk_department_id : '',
        task_assignment_id: taskDetails.task_assignment_id ? taskDetails.task_assignment_id : ''
    });
    }

  assignUser(){
    this.spinner.show();
    const userData = JSON.parse(localStorage.getItem('userData'));

    const token    = localStorage.getItem('userToken');

    this.route = 'assign-user-list';

    let data = {'user_id': userData.id};

    this._service.postRequestCreator(data, this.route, token).subscribe((result: any) => {

      this.assignUserList = result;

    });
    this.spinner.hide();
  }

  submitTaskAssigned(){

  /* this.submitted = false;
    console.log(this.taskAssignForm.controls['tasks'].dirty);
    console.log(this.taskAssignForm.invalid);
    if (this.taskAssignForm.invalid) {
      return;
    }*/

    const token    = localStorage.getItem('userToken');

    // const i = index;

    // console.log(this.taskAssignForm.value.tasks[i]);

    for(var i=0; i< this.taskAssignForm.value.tasks.length; i++){
      var selectedTaskDurationToDate = this.taskAssignForm.value.tasks[i].task_duration_to;
      var selectedTaskDurationFromDate = this.taskAssignForm.value.tasks[i].task_duration_from;

      selectedTaskDurationToDate = new Date(selectedTaskDurationToDate);
      selectedTaskDurationFromDate = new Date(selectedTaskDurationFromDate);

      if (selectedTaskDurationToDate.toDateString() === 'Invalid Date'){
        selectedTaskDurationToDate = this.taskAssignForm.value.tasks[i].task_duration_to;
      }else{
        selectedTaskDurationToDate = selectedTaskDurationToDate.toLocaleDateString();

        selectedTaskDurationToDate = selectedTaskDurationToDate.split("/").reverse().join("-");
        // selectedTaskDurationToDate = new Date(selectedTaskDurationToDate);
      }

      if (selectedTaskDurationFromDate.toDateString() === 'Invalid Date'){
        selectedTaskDurationFromDate = this.taskAssignForm.value.tasks[i].task_duration_to;
      }else{
        selectedTaskDurationFromDate = selectedTaskDurationFromDate.toLocaleDateString();
        selectedTaskDurationFromDate = selectedTaskDurationFromDate.split("/").reverse().join("-");
        // selectedTaskDurationFromDate = new Date(selectedTaskDurationFromDate);
      }

      this.taskAssignForm.value.tasks[i].task_duration_to = selectedTaskDurationToDate;
      this.taskAssignForm.value.tasks[i].task_duration_from = selectedTaskDurationFromDate;


    this.taskAssignForm.value.tasks[i]['is_assign'] = 1;

    }
    //console.log(this.taskAssignForm.value.tasks);

    swal({
      title: 'Are you sure?',
      text: 'You want to assign task!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#30d633',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.route = 'store-task-detail';
          const token    = localStorage.getItem('userToken');
          this._service.postRequestCreator(this.taskAssignForm.value, this.route, token).subscribe((result: any) => {
            // console.log(result);
            if(result.status == 'success'){
              this.spinner.hide();
              swal(
                  'Success',
                  'You have successfully assigned the task',
                  'success'
              )
              this.getTaskDetail(this.projectId,this.departmentId);
              // this.router.navigate(['/project-ref'],{ queryParams: { projectid: this.projectId }});
            }else if(result.status == 'date_error'){
              this.spinner.hide();
              swal(
                  'Warning',
                  result.message,
                  'warning'
              )
            }else{

              swal(
                  'Error',
                  'Something went please try again',
                  'error'
              )
            }

          });
      }
    });

  }

  taskBetween(taskDate,taskAttribute){
    /*console.log(taskDate);
    this.taskDate = taskDate
    this.taskAttribute = taskAttribute
    this.route = 'get-project-detail';
    let data = {
      'project_id': this.projectId
    };
    const token    = localStorage.getItem('userToken');
    this._service.postRequestCreator(data, this.route, token).subscribe((result: any) => {
      var dateBetween = '';
      // console.log(result);
      if(result.status == 'success'){
        var selectedTaskCreationdate = result.created_at;
        var selectedTaskDeadlineDate = result.deadline;
        selectedTaskCreationdate = selectedTaskCreationdate.substring(0,10);
        selectedTaskCreationdate = selectedTaskCreationdate.split("-").reverse().join("/");
        selectedTaskDeadlineDate = selectedTaskDeadlineDate.split("-").reverse().join("/");
      //  console.log(selectedTaskCreationdate);
        //console.log(selectedTaskDeadlineDate);
        console.log(this.taskDate)
        switch (this.taskAttribute) {
          case 'task_duration_from':
              if(this.taskDate < result.created_at){
                dateBetween ="Please assign task between "+selectedTaskCreationdate+" & "+selectedTaskDeadlineDate;
              }else if(this.taskDate > result.deadline){
                dateBetween ="Please assign task between "+selectedTaskCreationdate+" & "+selectedTaskDeadlineDate;
              }
            break;
          case 'task_duration_to':
            if(this.taskDate < result.created_at){
              dateBetween ="Please assign task between "+selectedTaskCreationdate+" & "+selectedTaskDeadlineDate;
            }else if(this.taskDate > result.deadline){
              dateBetween ="Please assign task between "+selectedTaskCreationdate+" & "+selectedTaskDeadlineDate;
            }
        }
        this.spinner.hide();
        if(dateBetween){
        swal(
            'Warning',
            dateBetween,
            'warning'
        )}
      }else{
        this.spinner.hide();
        swal(
            'Error',
            'Something went please try again',
            'error'
        )
      }

    });*/
  }

}
