import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-performance-management',
  templateUrl: './performance-management.component.html',
  styleUrls: ['./performance-management.component.css']
})
export class PerformanceManagementComponent implements OnInit {

  columnChart: Chart;
  stackedBarChart: Chart;
  biDirectionBarChart: Chart;
  gaugeValues: any = {
    1: 100,
    2: 18,
    3: 50,
    4: 50,
    5: 50,
    6: 50,
    7: 50
  };
  constructor() { }

  ngOnInit() {
    // this.drawPieChart();
    this.drawColumnChart();
    this.drawStackedBarChart();
    this.drawBiDirectionBarChart();
  }



  drawColumnChart() {
    let columnChart = new Chart({
      chart: {
        type: 'bar'
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        categories: [
          'Ahmadiah',
          'Al Bin Abi Talib',
          'Khafji',
          'Ghazala',
          'Alreem'
        ],
        crosshair: true
      },
      credits: {
        enabled: false
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: ''
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          showInLegend: false
        }
      },
      series: [{
        name: 'Total',
        color:'#55CD3C',
        data: [89, 66, 38, 27, 28]

      }/*, {
        name: 'Closed',
        color:'#003863',
        data: [120, 10, 180, 20, 100, 175, 132]

      }*/]
    });

    this.columnChart = columnChart;
  }

  drawStackedBarChart() {
    let stackBarChart = new Chart({
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Stacked bar chart'
      },
      xAxis: {
        categories: ['Nazi', 'Basim', 'Karim']
      },
      yAxis: {
        min: 0,
        max:15,
        title: {
          text: 'Total fruit consumption'
        }
      },
      legend: {
        reversed: true
      },
      plotOptions: {
        series: {
          stacking: 'normal'
        }
      },
      series: [{
        name: 'Overdue',
        color:'red',
        data: [3, 4, 4]
      },{
        name: 'Remaining',
        color:'yellow',
        data: [2, 2, 3]
      },{
        name: 'Completed',
        color:'#55cd3c',
        data: [5, 3, 4]
      }]
    });
    this.stackedBarChart = stackBarChart;
  }

  drawBiDirectionBarChart() {
    let categories = ['Projects Created','On-track Projects','Delayed Projects'
    ];
    let biDirBarChart = new Chart({
      chart: {
        type: 'bar'
      },
      title: {
        // text: 'Population pyramid for Germany, 2018'
        text: ''
      },
      subtitle: {
        // text: 'Source: <a href="http://populationpyramid.net/germany/2018/">Population Pyramids of the World from 1950 to 2100</a>'
        text: ''
      },
      xAxis: [{
        categories: categories,
        reversed: false,
        labels: {
          step: 1
        }
      }, { // mirror axis on right side
        opposite: true,
        reversed: false,
        categories: categories,
        linkedTo: 0,
        labels: {
          step: 1
        }
      }],
      yAxis: {
        title: {
          text: null
        },
        min: -100,
        max:100,
        labels: {
          formatter: function () {
            return Math.abs(this.value) + '%';
          }
        },
        tickInterval:25
      },

      plotOptions: {
        series: {
          stacking: 'normal'
        }
      },

      series: [{
        name: 'Planned',
        data: [
          -35, -50, -60
        ]
      }, {
        name: 'Executed',
        data: [
          30, 40, 55
        ]
      }]
    });
    this.biDirectionBarChart = biDirBarChart;
  }  
}
