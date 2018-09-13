import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-ticket-analysis',
  templateUrl: './ticket-analysis.component.html',
  styleUrls: ['./ticket-analysis.component.css']
})
export class TicketAnalysisComponent implements OnInit {

  pieChart: Chart;
  columnChart: Chart;
  departmentWiseData:any;
  constructor() { }

  ngOnInit() {
    this.departmentWiseData = [{
      name: 'Marketing',
      y: 21,
      color:'#0033C6',
    }, {
      name: 'IT',
      y: 10,
      color:'#0059EC',
    }, {
      name: 'Security',
      y: 17,
      color:'#0080FE',
    }, {
      name: 'Operations',
      y: 5,
      color:'#33A0FE',
    }, {
      name: 'Support',
      y: 16,
      color:'#50BCFE',
    }];

    this.drawPieChart();
    this.drawColumnChart();
  }

  drawPieChart() {
    let chart = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        margin: [0, 80, 0, 0],
        spacingTop: 0,
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 0,
        type: 'pie'
      },
      title: {
        text: ''
      },
      legend: {
        enabled: true,
        verticalAlign: 'xbottom',
        align:'right',
        layout: 'vertical'

      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
            align: 'left'
          },
          showInLegend: true
        }
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Tickets',
        data: this.departmentWiseData
      }]
    });

    this.pieChart = chart;
  }

  drawColumnChart() {
    let columnChart = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        categories: [
          'Dec 30',
          'Jan 03',
          'Jan 05',
          'Jan 09',
          'Jan 12',
          'Jan 18',
          'Jan 27',
        ],
        crosshair: true
      },
      credits: {
        enabled: false
      },
      yAxis: {
        min: 0,
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
        color:'#003863',
        data: [150, 125, 200, 51, 124, 180, 140]

      }, {
        name: 'Closed',
        color:'#003863',
        data: [120, 10, 180, 20, 100, 175, 132]

      }]
    });

    this.columnChart = columnChart;
  }

}
