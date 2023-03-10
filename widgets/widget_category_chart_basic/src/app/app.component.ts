import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, NgZone } from '@angular/core';
import { WidgetContent, IWidgetBase, } from './widget.model';
import { ISignalEvent, ESignalEventType } from './enum-signal.model'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { ENGINE_METHOD_DIGESTS } from 'constants';
//import am4themes_animated from "@amcharts/amcharts4/themes/animated";


@Component({
  selector: 'app-widget-component',
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})


export class AppComponent implements IWidgetBase {
  content: WidgetContent;
  chart: am4charts.XYChart;

  isBucket:boolean = false;

  //element
  @ViewChild('columnChart') columnChart: ElementRef;

  constructor(private zone: NgZone) {
  }

  loadData() {
    this.content.isLoading = true;
    this.content.sendSignalFromWPromise(ESignalEventType.LoadData, null)
      .then(r => //resolve    
      {
        if (r.Dimension1 && r.Metric1) {
          this.chart.data = [];
         
          if(this.isBucket == true)
          {
            for (let i = 0; i < r.Dimension1.length - 1; i++) {

              let dimension = "[[" + r.Dimension1[i] + " - " + r.Dimension1[i + 1] + "]]";
              let metric = r.Metric1[i];
  
              if (i == r.Dimension1.length - 2) {
                metric += r.Metric1[i + 1];
              }
  
              this.chart.data[i] = { 'dimensions': dimension, "metrics": metric }
            }
          }
          else
          {
            for (let i = 0; i < r.Dimension1.length; i++) {
            
              let dimension = r.Dimension1[i];
              let metric = r.Metric1[i];
  
              this.chart.data[i] = { 'dimensions': dimension, "metrics": metric }
            }
          }

         

          this.chart.validateData();
          this.content.isValid = true;
        } else {
          this.content.isValid = false;
        }
      },
        //reject
        (msg) => {
          this.content.isValid = false;
          console.log('error');
        }
      ).finally(() => {
        this.content.isLoading = false;
      })
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      // setup the chart
      this.chart = am4core.create(this.columnChart.nativeElement, am4charts.XYChart);
      this.chart.paddingBottom = 10;

      // Create axes
      var categoryAxis = this.chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "dimensions";
      //categoryAxis.numberFormatter.numberFormat = "#";
      categoryAxis.renderer.inversed = false;
      // categoryAxis.renderer.minGridDistance = 1;
      // categoryAxis.renderer.grid.template.disabled = true;
      // categoryAxis.renderer.labels.template.rotation = 270;
      // categoryAxis.renderer.labels.template.verticalCenter = "middle";
      // categoryAxis.renderer.labels.template.horizontalCenter = "right";

      var  valueAxis = this.chart.xAxes.push(new am4charts.ValueAxis()); 

      // Create series
      var series = this.chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = "metrics";
      series.dataFields.categoryY = "dimensions";
      series.name = "Metrics";
      series.columns.template.propertyFields.fill = "color";
      series.columns.template.tooltipText = "{valueX}";    

       let columnTemplate = series.columns.template;
       columnTemplate.tooltipText = "{categoryX}: [bold]{valueY}[/]";
       columnTemplate.strokeWidth = 2;
       columnTemplate.strokeOpacity = 0;
       columnTemplate.fill = am4core.color("#3b5998");
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  ngOnInit() {
    this.content.subscribeSignalToWPromise((event) => {

      switch (event.type) {

        case ESignalEventType.LoadConfiguration: {

            if(event.object.parameters.data.binding.dimensionAxes[0].function == "Buckets")
            {
              this.isBucket = true;
            }
            else
            {
              this.isBucket = false;
            }         

          this.loadData();
          break;
        }
        case ESignalEventType.DataMapping: //event from data mapping change - save configuration and load data
          if (!event.object) {
            event.reject();
            return;
          }
          if(event.object.binding.dimensionAxes[0].function == "Buckets")
            {
              this.isBucket = true;
            }
            else
            {
              this.isBucket = false;
            }  
          this.content.isLoading = true;

          this.content.sendSignalFromWPromise(ESignalEventType.SaveConfiguration, { layout: {}, data: event.object })
            .then(
              //resolve
              (res) => {
                this.content.isLoading = false;
                if (res) {
                  this.loadData();
                  //send response that it was
                }
              },
              //reject
              (msg) => {
                this.content.isLoading = false;
              }
            ).finally(() => {
              event.resolve();
            });
          break;
        case ESignalEventType.ValueChanged: { //event from design 
          // update X/Y label
          switch (event.name) {
            case 'dataMappingColumnChart':
              event.resolve();
              break;
          }
        }
          break;
        case ESignalEventType.LayoutDesign: // this signal is sent at first to init widget          
          if (event.name == "position") {
            if (this.chart) {
              let containerStyle = this.chart.svgContainer.htmlElement.style;
              containerStyle.width = this.content.width + "px";
              containerStyle.height = this.content.height + "px";
            }
          }
          event.resolve('the resizing was done!');
          break;
        default:
          event.resolve();
          break;
      }
    });

    // trigger signal core to send back the position, which must be be subscribed
    this.content.sendSignalFromWPromise(ESignalEventType.WReady, null).then(r => {
    });
  }
}