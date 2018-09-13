import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team-performance',
  templateUrl: './team-performance.component.html',
  styleUrls: ['./team-performance.component.css']
})
export class TeamPerformanceComponent implements OnInit {
  team:any;
  constructor() { }

  ngOnInit() {
    this.team = [{
      'name':"NAME",
      'last_name':"LASTNAME"
    },{
      'name':"NAME",
      'last_name':"LASTNAME"
    },{
      'name':"NAME",
      'last_name':"LASTNAME"
    },{
      'name':"NAME",
      'last_name':"LASTNAME"
    },{
      'name':"NAME",
      'last_name':"LASTNAME"
    },{
      'name':"NAME",
      'last_name':"LASTNAME"
    }]
  }

}
