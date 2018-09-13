import { Component, OnInit } from '@angular/core';
import { CommonService } from '../_services';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import { FormBuilder, FormControl , FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
@Component({
  selector: 'app-property-pricing',
  templateUrl: './property-pricing.component.html',
  styleUrls: ['./property-pricing.component.css']
})
export class PropertyPricingComponent implements OnInit {
  activeOption:string = 'selectType';

  constructor(private activeroute: ActivatedRoute,private router: Router,private _service: CommonService,private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 1000);

    this.activeOption = 'property';
  }

  goToNextOption(nextOption:string, validationFor:string){
    if (!nextOption){
      return;
    }

    this.activeOption = nextOption;
  }

}
