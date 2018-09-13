import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {

  constructor( private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);


  }

}
