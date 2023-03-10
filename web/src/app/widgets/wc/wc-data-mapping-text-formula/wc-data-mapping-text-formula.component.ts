import { Component, OnInit } from '@angular/core';
import { Dataset, DatasetColumn, DataMappingRule, DataMappingValue } from './models/model';
import { WidgetControlContent } from '../../models/wc.model';
import { ISignalEvent, ESignalEventType } from '../../models/enum-signal.model';
import { WcDataMappingColumnChartService } from '../../wc/wc-data-mapping-column-chart/wc-data-mapping-chart.service';
import { FormControl, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-wc-data-mapping-text-formula',
  templateUrl: './wc-data-mapping-text-formula.component.html',
  styleUrls: ['./wc-data-mapping-text-formula.component.scss']
})
export class WcDataMappingTextFormulaComponent implements OnInit {

  content: WidgetControlContent;

  inputValuePreffix = new FormControl();
  inputValueSuffix = new FormControl();
  

  public showFuncs: boolean;
  private dropDownInsideClickEnabled: boolean = true;

  private selectedDs: Dataset;
  private datasets: Array<Dataset>;
  private allAxis: Array<DatasetColumn> = [];

  private xName: string;
  private xFuncName: string;
  private xAxis: Array<DatasetColumn> = [];
  private xAxisValue: DatasetColumn = undefined;

  private yName: string;
  private yFuncName: string;
  private yAxis: Array<DatasetColumn> = [];
  private yAxisValue: DatasetColumn = undefined;
  private yFuncs: Array<DataMappingRule.EFunctions> = [];
  private yFuncValue: DataMappingRule.EFunctions = undefined; // ?

  private _loadingDataset: boolean = true;
  private loadingX: boolean = true;
  private loadingY: boolean = true;
  private loading = true;
  private loadingDetail = true;

  public allFunctions: Array<any> = [{
    name: 'COUNT',
    enabled: false,
    type: DataMappingRule.EFunctions.Count
  }, {
    name: 'SUM',
    enabled: false,
    type: DataMappingRule.EFunctions.Sum
  }, {
    name: 'AVG',
    enabled: false,
    type: DataMappingRule.EFunctions.Avg
  }, {
    name: 'MAX',
    enabled: false,
    type: DataMappingRule.EFunctions.Max
  }, {
    name: 'MIN',
    enabled: false,
    type: DataMappingRule.EFunctions.Min
  }];


  constructor(private wcdmcchs: WcDataMappingColumnChartService) {

  }

  ngOnInit() {
    this.content.subscribeSignalToWcPromise((event) => {
      this.processEventFromWidget(event)
    });

    // this.yFuncs = [
    //   DataMappingRule.EFunctions.Sum,
    //   DataMappingRule.EFunctions.Count,
    //   DataMappingRule.EFunctions.Avg
    // ];

    this.yFuncs = [
      DataMappingRule.EFunctions.Count,
      DataMappingRule.EFunctions.Sum,
      DataMappingRule.EFunctions.Avg,
      DataMappingRule.EFunctions.Max,
      DataMappingRule.EFunctions.Min
    ];

    this.selectedDs = null;
    this.onYFuncChange(DataMappingRule.EFunctions.Sum);
  }

  processEventFromWidget(event?: ISignalEvent) {
    var binding;
    if (event.type == ESignalEventType.LoadConfiguration) {
      if (event.object && event.object.parameters
        && event.object.parameters.data
        && event.object.parameters.data.binding) {
        binding = event.object.parameters.data.binding as DataMappingValue.Binding;
      }
      // obtain datasets
      this._loadingDataset = true;
      this.wcdmcchs.getDatasets()
        .then(r => {
          this.datasets = r;
          if (binding) {
            //set default dataset;
            this.selectedDs = this.datasets.find(d => d.datasetUID == binding.dataset);
            this.datasetChanged(binding);
          }
        })
        .finally(() => { this._loadingDataset = false; });

      //register event from W to WC

    }
  }

  setDefaults(def: any) {

  }

  datasetChanged(binding: DataMappingValue.Binding = null) {
    this.xAxisValue = undefined;

    if (this.selectedDs) {
      this.loadingDetail = true;
      this.wcdmcchs.getDatasetDetail(this.selectedDs).
        then(r => {
          this.allAxis = r.datasetColumns.map(x => {
            x.convertedType = this.convertColumnType(x.columnType);
            x.columnTypeName = this.makeTextColumnType(x.columnType);
            return x;
          });

          this.xAxis = this.allAxis.filter(r => true);
          this.onYFuncChange(DataMappingRule.EFunctions.Sum);

          if (!binding) {
            this.xAxisValue = null;
            this.yAxisValue = null;
            return;
          }

          this.xName = binding.dimensionAxes[0].name;
          this.yName = binding.metricAxes[0].name;

          this.xAxisValue = this.allAxis.find(f => f.columnName == binding.dimensionAxes[0].columnName);
          this.onXAxisChange();

          this.onYFuncChange(DataMappingRule.EFunctions[binding.metricAxes[0]['function']]);
          this.onYAxisChange(this.yAxis.find(f => f.columnName == binding.metricAxes[0].columnName));
        })
        .finally(() => {
          this.loadingDetail = false;
        });
    } else {

    }
  }

  onXAxisChange(item = null) {
    this.xAxisValue = item;
    this.databind();
    this.dropDownInsideClickEnabled = false;
  }

  onYAxisChange(item = null) {
    this.yAxisValue = item;
    this.databind();
    this.dropDownInsideClickEnabled = false;
  }

  handleSearchClicked(item = null) {
    this.dropDownInsideClickEnabled = true;
  };

  onYFuncChange(item: any) {
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

  databind() {
    
    this.loading = true;
    var binding = new DataMappingValue.Binding()
    binding.dataset = this.selectedDs.datasetUID;

    binding.dimensionAxes = [new DataMappingValue.Axis()];
    binding.metricAxes = [new DataMappingValue.Axis()];

    binding.dimensionAxes[0].columnName = this.xAxisValue ? this.xAxisValue.columnName : null;
    binding.metricAxes[0].columnName = this.yAxisValue ? this.yAxisValue.columnName : null;

    binding.dimensionAxes[0].name = this.xName;
    binding.metricAxes[0].name = this.yName;

    binding.metricAxes[0].function = DataMappingRule.EFunctions[this.yFuncValue];

    // send event from WC to W
    if (this.yAxisValue && binding.metricAxes[0].function) {
      this.content.sendSignalFromWcPromise(ESignalEventType.DataMapping, binding.toNewJs())
        .then((result) => {
        }).finally(() => {
          this.loading = false;
        });
    }
  }

  convertColumnType(type): DataMappingRule.EColumnType {
    switch (type) {
      case "System.Double":
        return DataMappingRule.EColumnType.decimal;
      case "System.Int32":
      case "System.Int64":
        return DataMappingRule.EColumnType.integer;
      case "System.String":
        return DataMappingRule.EColumnType.string;
      case "System.DateTime":
        return DataMappingRule.EColumnType.datetime;
    }
  }

  makeTextColumnType(type): string {
    switch (type) {
      case "System.Double":
      case "System.Int32":
      case "System.Int64":
        return '123';
      case "System.String":
        return 'ABC';
      case "System.DateTime":
        return 'dt'
    }
  }

  onChangePreffix()
  {
    this.content.sendSignalFromWcPromise(ESignalEventType.ChangePreffix,this.inputValuePreffix.value).then(r=>{
      //this.isLoading=false;
    });
  }

  onChangeSuffix()
  {
    this.content.sendSignalFromWcPromise(ESignalEventType.ChangeSuffix,this.inputValueSuffix.value).then(r=>{
      //this.isLoading=false;
    });
  }

}
