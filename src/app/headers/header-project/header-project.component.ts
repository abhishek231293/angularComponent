import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../_services';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-header-project',
  templateUrl: './header-project.component.html',
  styleUrls: ['./header-project.component.css']
})
export class HeaderProjectComponent implements OnInit {
  projects: any;
  projectId:string;
  route:string;
  public apiBaseUrl: string = environment.apiBaseUrl;
  constructor(private activeroute: ActivatedRoute,private router: Router,
              private _service: CommonService) { }
  ngOnInit() {
    this.projects = [{
      'case_no':0,
      'project_age':0,
      'first_name':'NA',
      'branch_code':'0',
      'purpose':'NA'
    }];
    this.activeroute.queryParams.subscribe(params => {

      if(params['projectid']){
        this.projectId = params['projectid'];
      }
      if(params['project_id']){
        this.projectId = params['project_id'];
      }
      this.getProjects(this.projectId);
    })
  }
  getProjects(id="false"){
    this.route     = 'project-list';
    let data       = {'project_id':id};
    const token    = localStorage.getItem('userToken');
    this._service.postRequestCreator(data, this.route, token).subscribe((response: any) => {
      if(response.status == 204) {
        this.router.navigate(['login']);
      }
      if(response.status == 'success'){
        this.projects = response.result;
      }
    });
  }
}

