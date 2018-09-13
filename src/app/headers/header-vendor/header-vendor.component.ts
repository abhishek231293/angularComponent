import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-header-vendor',
  templateUrl: './header-vendor.component.html',
  styleUrls: ['./header-vendor.component.css']
})
export class HeaderVendorComponent implements OnInit {

  user_name ='';
  user_image = '';
  constructor(private router: Router) { }

  API_BASE_URL = environment.apiBaseUrl;

  ngOnInit() {
    const token    = localStorage.getItem('userToken');
  }

}