import { Component, OnInit } from '@angular/core';
import { CommonService } from '../_services';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import * as $ from 'jquery';
import {environment} from '../../environments/environment';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  projectId;
  constructor(private activeroute: ActivatedRoute,private router: Router,
              private _service: CommonService,private spinner: NgxSpinnerService) { }

  estimatedDays:number;
  completedDays:number;
  documentsList:any;
  
  ngOnInit() {
    this.activeroute.queryParams.subscribe(params => {
      this.spinner.show();
      this.projectId = params['projectid'];      
      /*if(userData.role=='userA' && this.mode=='edit'){
       this.router.navigate(['cases']);
       }*/
      setTimeout(()=>{
        this.spinner.hide();
      }, 1000);
    })
    this.documentsList = [{
      'name':'Architectural Drawing',
      'file_name':'dummy1.pdf'
    },
      {
        'name':'Street view at least 3 photo',
        'file_name':'dummy2.pdf'
      },
      {
        'name':'Satellite imagery',
        'file_name':'dummy1.pdf'
      },
      {
        'name':'master Plan for area',
        'file_name':'dummy2.pdf'
      }]

    this.estimatedDays = 100;
    this.completedDays = 70;
  }

}
