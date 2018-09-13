import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../_services';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';


@Component({
  selector: 'app-header-project-nologin',
  templateUrl: './header-project-nologin.component.html',
  styleUrls: ['./header-project-nologin.component.css']
})
export class HeaderProjectNologinComponent implements OnInit {
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
      this.getProjects();
    })
  }

  getProjects(){
    this.route     = 'project-lists';
    let data       = {'project_id':this.projectId};
    this._service.postRequestNoTokenCreator(data, this.route).subscribe((response: any) => {
      if(response.status == 'success'){
        this.projects = response.result;
      }
    });
  }

}
