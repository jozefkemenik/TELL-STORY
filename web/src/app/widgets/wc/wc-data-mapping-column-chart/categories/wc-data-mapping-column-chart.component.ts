import { Component, OnInit } from '@angular/core';
import { Dataset, DatasetColumn, DataMappingRule, DataMappingValue } from '../models/model';
import { WidgetControlContent } from '../../../models/wc.model';
import { ISignalEvent, ESignalEventType } from '../../../models/enum-signal.model';
import { WcDataMappingColumnChartService } from '../wc-data-mapping-chart.service';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';

import { Options } from 'ng5-slider';

@Component({
  selector: 'app-wc-data-mapping-column-chart',
  templateUrl: './wc-data-mapping-column-chart.component.html',
  styleUrls: ['./wc-data-mapping-column-chart.component.scss']
})

export class WcDataMappingCategoriesComponent implements OnInit {

  inputValuePreffix = new FormControl();
  inputValueSuffix = new FormControl();
  inputValueText = new FormControl();

  private flagSave: boolean;

  content: WidgetControlContent;
  private dropDownInsideClickEnabled: boolean = true;

  bucketOptions: Options = {
    floor: 1,
    //ceil: 10,
    showSelectionBar: true,
    showTicks: false,
    //tickStep: 10,
    step: 1,
    animate: false,
    translate: (value: number): string => {
      return '' + value;
    }
  };

  limitOptions: Options = {
    floor: 1,
    //ceil: 10,
    showSelectionBar: true,
    showTicks: false,
    //tickStep: 10,
    step: 1,
    animate: false,
    translate: (value: number): string => {
      return '' + value;
    }
  };


  private selectedDs: Dataset;

  private datasets: Array<Dataset>;

  private allAxis: Array<DatasetColumn> = [];

  private xAxisValue: DatasetColumn = undefined;
  private xAxis: Array<DatasetColumn> = [];

  private xFuncValue = DataMappingRule.EFunctions.DistinctValues;
  private sortingValue: string = undefined;

  private yAxisValue: DatasetColumn = undefined;
  private yAxis: Array<DatasetColumn> = [];

  private yFuncValue: DataMappingRule.EFunctions = undefined;
  private yFuncs: Array<DataMappingRule.EFunctions> = [];

  private TextContent: string;

  private sliderLimitValue: number = 0;
  private sliderBucketValue: number = 0;
  private loading = true;
  private showLimit = false;
  private showBucket = false
  private xName: string;
  private yName: string;
  private yFuncName: string;
  public allFunctions: Array<any> = [{
    name: 'SUM',
    enabled: false,
    type: DataMappingRule.EFunctions.Sum
  }, {
    name: 'COUNT',
    enabled: false,
    type: DataMappingRule.EFunctions.Count
  }, {
    name: 'AVG',
    enabled: false,
    type: DataMappingRule.EFunctions.Avg
  }, {
    name: 'MIN',
    enabled: false,
    type: DataMappingRule.EFunctions.Min
  }, {
    name: 'MAX',
    enabled: false,
    type: DataMappingRule.EFunctions.Max
  }];



  constructor(private wcdmcchs: WcDataMappingColumnChartService) {

  }

  ngOnInit() {
    // if 0 the control is not visible
    this.bucketOptions.ceil = this.content.maxBucket;
    this.limitOptions.ceil = this.content.maxLimit;

    this.content.subscribeSignalToWcPromise((event) => {
      this.processEventFromWidget(event)
    });

    this.yFuncs = [
      DataMappingRule.EFunctions.Sum,
      DataMappingRule.EFunctions.Count,
      DataMappingRule.EFunctions.Avg];

    this.selectedDs = null;
    this.onYFuncChangeInit(DataMappingRule.EFunctions.Sum);

  }

  processEventFromWidget(event?: ISignalEvent) {

    var binding;

    if (event.type == ESignalEventType.WReady && this.content.displayInputText==false) {
      this.loading = false;
    }

    if (event.type == ESignalEventType.LoadConfiguration) {

      if(this.content.maxBucket>0 && this.content.maxLimit>0)
      {
        this.valueLimit = event.object.parameters.data.binding.limitOffset.limit;
        this.valueBucket = event.object.parameters.data.binding.limitOffset.limit;
        this.sliderBucketValue = this.valueBucket;
        this.sliderLimitValue = this.valueLimit;
      }

      if(this.content.maxBucket == 0 && this.content.maxLimit > 0)
      {
        this.valueLimit = event.object.parameters.data.binding.limitOffset.limit;
        this.sliderLimitValue = this.valueLimit;
      }

      if(this.content.maxBucket > 0 && this.content.maxLimit == 0)
      {
        this.valueBucket = event.object.parameters.data.binding.dimensionAxes[0].bucketsCount;
        this.sliderBucketValue = this.valueBucket;  
      }
     

      if (this.content.displayInputText) {
        if (event.object && event.object.parameters && event.object.parameters.data && event.object.parameters.data.value) {
          this.inputValueText.setValue(event.object.parameters.data.value);
        } else if (event.object && event.object.data && event.object.data.parameters && event.object.data.parameters.data &&
          event.object.data.parameters.data.value) {
          this.inputValueText.setValue(event.object.data.parameters.data.value);
        }

        this.loading = false;
      }
      else {
        if (event.object && event.object.parameters
          && event.object.parameters.data
          && event.object.parameters.data.binding) {
          binding = event.object.parameters.data.binding as DataMappingValue.Binding;
        }

        this.datasets = this.content.datasets as Array<Dataset>;
        if (binding) {
          //set default dataset;
          this.selectedDs = this.datasets.find(d => d.datasetUID == binding.dataset);
          this.datasetChanged(binding);
        }
      }
    } else if (event.type == ESignalEventType.ChangeTextWtoWC) {
      this.inputValueText.setValue(event.object);
      this.TextContent = event.object;
      this.flagSave = false;
      this.loading = false;
    }
    else if (event.type == ESignalEventType.ValueChanged) {
      this.inputValueText.setValue(event.object);
      this.TextContent = event.object;
      this.flagSave = true;
      this.databind();
      this.loading = false;
    }

  }

  populateDs(ds: Dataset) {
    return this.wcdmcchs.getDatasetDetail(ds).
      then(r => {
        this.allAxis = this.allAxis.concat(r.datasetColumns.map(x => {
          x.convertedType = this.convertColumnType(x.columnType);
          x.columnTypeName = this.makeTextColumnType(x.columnType);
          x.datasetId = ds.datasetId;
          return x;
        }));
      });
  }


  datasetChanged(binding: DataMappingValue.Binding = null) {
    this.loading = true;

    var allFn = this.datasets.map((ds) => { return this.populateDs(ds) });
    Promise.all(allFn).then(() => {
      this.initControls(binding);
    }).finally(() => {
      this.loading = false;
    });
  }


  initControls(binding: DataMappingValue.Binding = null) {
    this.xName = binding.dimensionAxes ? binding.dimensionAxes[0].name : 'Dimension1';
    this.yName = binding.metricAxes ? binding.metricAxes[0].name : 'Metric1';
    //filter by manifest
    this.xAxis = this.allAxis.filter(r => this.content.allowedColumTypes.includes(r.columnType));
    if (binding.dimensionAxes) {
      this.xAxisValue = this.allAxis.find(f => f.columnName == binding.dimensionAxes[0].columnName);
    }
    if (binding.metricAxes) {
      this.onYFuncChangeInit(DataMappingRule.EFunctions[binding.metricAxes[0]['function']]);
      this.yAxisValue = this.yAxis.find(f => f.columnName == binding.metricAxes[0].columnName);
    }

    this.checkShowBucket();
    this.switchBucket();
  }

  onXAxisChange(item) {
    this.xAxisValue = item;
    this.selectedDs = this.datasets.find(d => d.datasetId == item.datasetId);
    this.yAxis = this.allAxis.filter(f => f.datasetId == item.datasetId);
    this.checkShowBucket();
    this.switchBucket();
    this.databind();
    this.dropDownInsideClickEnabled = false;
  }

  checkShowBucket() {
    this.showBucket = this.bucketOptions.ceil>0 && 
    (this.xAxisValue.columnType === ColumnType.Int32 ||
      this.xAxisValue.columnType === ColumnType.Int64 ||
      this.xAxisValue.columnType === ColumnType.Double ||
      this.xAxisValue.columnType === ColumnType.Single);
  }

  // disable/enable sliders after check bucket
  switchBucket() {
    if (this.showBucket == true) {
      this.limitOptions.disabled = true;
      this.bucketOptions.disabled = false;
    }
    else {
      this.limitOptions.disabled = false;
      this.bucketOptions.disabled = true;
    }
  }

  onYFuncChange(item: any) {
    this.onYFuncChangeInit(item);
    this.databind();
  }

  onYFuncChangeInit(item: any) {
    this.dropDownInsideClickEnabled = true;
    this.yFuncName = this.allFunctions.find(f => f.type == item).name;
    this.yFuncValue = item;
    // get all parames for count functions
    if (this.yFuncValue == DataMappingRule.EFunctions.Count) {
      this.yAxis = this.allAxis.filter(f => true);
    } else {
      // in other case filter non string columns
      this.yAxis = this.allAxis.filter(f => f.convertedType != DataMappingRule.EColumnType.string);
    }
    if (this.yAxis.length == 1) {
      this.yAxisValue = this.yAxis[0];
    }
  }

  onYAxisChange(item = null) {
    this.yAxisValue = item;
    this.selectedDs = this.datasets.find(d => d.datasetId == item.datasetId);
    this.databind();
    this.dropDownInsideClickEnabled = false;
  }

  handleSearchClicked(item = null) {
    this.dropDownInsideClickEnabled = true;
  };

  databind() {
    if (this.content.displayInputText == true) {
      var bindingText = new DataMappingValue.TextBiding()

      bindingText.textContent = this.TextContent;

      // send event from WC to W
      if ((this.content.displayInputText && this.TextContent != undefined)) {

        if (this.flagSave == true) {
          this.content.sendSignalFromWcPromise(ESignalEventType.DataMapping,
            bindingText.toJs())
            .then((result) => {
            }).finally(() => {

            });
        }
        else {
          this.content.sendSignalFromWcPromise(ESignalEventType.ValueChanged,
            bindingText.toJs())
            .then((result) => {
            }).finally(() => {

            });
        }


      }




    }
    else {
      var binding = new DataMappingValue.Binding()

      binding.dimensionAxes = [new DataMappingValue.Axis()];
      binding.metricAxes = [new DataMappingValue.Axis()];

      if (this.content.displayPreffixSuffix) {
        binding.dataset = this.selectedDs.datasetUID;
        binding.metricAxes[0].columnName = this.yAxisValue ? this.yAxisValue.columnName : null;
        binding.metricAxes[0].name = this.yName;
        binding.metricAxes[0].function = DataMappingRule.EFunctions[this.yFuncValue];
      }
      else {
        binding.dataset = this.selectedDs.datasetUID;

        binding.dimensionAxes[0].columnName = this.xAxisValue ? this.xAxisValue.columnName : null;
        binding.metricAxes[0].columnName = this.yAxisValue ? this.yAxisValue.columnName : null;

        binding.dimensionAxes[0].name = this.xName;
        binding.metricAxes[0].name = this.yName;

        binding.dimensionAxes[0].function = DataMappingRule.EFunctions[this.xFuncValue];
        binding.metricAxes[0].function = DataMappingRule.EFunctions[this.yFuncValue];

        if (this.showBucket && this.sliderBucketValue > 0) {
          binding.dimensionAxes[0].function = "Buckets";
          binding.dimensionAxes[0].buckets = this.sliderBucketValue;

          binding.limitOffset = new DataMappingValue.Limit();
          binding.limitOffset.limit = this.sliderBucketValue+1;

          binding.order = new DataMappingValue.Order();
          binding.order.axisName = this.xName;
          binding.order.orderingType = "Asc";

          // histogram widget
          if (this.content.displayYAxisControl == false) {
            binding.metricAxes[0].columnName = binding.dimensionAxes[0].columnName;
          }

        }
      }

      if (!this.showBucket && this.sliderLimitValue > 0) {
        binding.limitOffset = new DataMappingValue.Limit();
        binding.limitOffset.limit = this.sliderLimitValue;
      }

      // send event from WC to W
      if (((this.content.displayYAxisControl && binding.metricAxes[0].function) || !this.content.displayYAxisControl) &&
        ((this.content.displayXAxisControl && binding.dimensionAxes[0].function) || !this.content.displayXAxisControl)) {
        this.content.sendSignalFromWcPromise(ESignalEventType.DataMapping,
          binding.toJs())
          .then((result) => {
          }).finally(() => {

          });
      }
    }


  }

  valueBucket = 1;
  valueBucketChange(): void {
    this.sliderBucketValue = this.valueBucket;
    this.databind();
  }

  valueLimit = 1;
  valueLimitChange(): void {
    this.sliderLimitValue = this.valueLimit;
    this.databind();
  }


  convertColumnType(type): DataMappingRule.EColumnType {
    switch (type) {
      case ColumnType.Double:
        return DataMappingRule.EColumnType.decimal;
      case ColumnType.Int32:
      case ColumnType.Int64:
        return DataMappingRule.EColumnType.integer;
      case ColumnType.String:
        return DataMappingRule.EColumnType.string;
      case ColumnType.DateTime:
        return DataMappingRule.EColumnType.datetime;
    }
  }

  makeTextColumnType(type): string {
    switch (type) {
      case ColumnType.Double:
      case ColumnType.Single:
        return '1.23';
      case ColumnType.Int32:
      case ColumnType.Int64:
        return '123';
      case ColumnType.String:
        return 'ABC';
      case ColumnType.DateTime:
        return 'dt'
    }
  }

  onChangePreffix() {
    this.content.sendSignalFromWcPromise(ESignalEventType.ChangePreffix, this.inputValuePreffix.value).then(r => {
      //this.isLoading=false;
    });
  }

  onChangeSuffix() {
    this.content.sendSignalFromWcPromise(ESignalEventType.ChangeSuffix, this.inputValueSuffix.value).then(r => {
      //this.isLoading=false;
    });
  }

  onChangeText() {
    this.flagSave = false;
    this.TextContent = this.inputValueText.value;
    this.databind();
  }

  onSaveText() {
    this.flagSave = true;
    this.TextContent = this.inputValueText.value;
    this.databind();
  }

  onSortChange() {
    //this.databind();
  }

}

enum ColumnType {
  Double = "System.Double",
  Single = "System.Single",
  Int32 = "System.Int32",
  Int64 = "System.Int64",
  String = "System.String",
  DateTime = "System.DateTime"
}
