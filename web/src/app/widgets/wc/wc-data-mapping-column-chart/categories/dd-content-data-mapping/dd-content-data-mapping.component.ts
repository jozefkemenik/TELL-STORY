import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Dataset, DatasetColumn, DataMappingRule, DataMappingValue } from '../../models/model';

@Component({
  selector: 'app-dd-content-data-mapping',
  templateUrl: './dd-content-data-mapping.component.html',
  styleUrls: ['./dd-content-data-mapping.component.scss']
})
export class DdContentDataMappingComponent {
  @Input() title:string
  @Input() datasets: Array<Dataset>;
  @Output('onSearchClicked') onSearchClicked = new EventEmitter();

  private _columns: Array<DatasetColumn>=[];
  @Input('columns')
  set columns(value: Array<DatasetColumn>) {
    var result = {};
    value.forEach(r=>{
      r.totalNmbDesc = 'UNIQUE';
      r.totalNmb = Math.floor((Math.random() * 100) + 1);
      if(!result[r.datasetId]){
        result[r.datasetId]=[];
      }
      result[r.datasetId].push(r);    
    })
    for(var item in  result){
      var d = new DatasetColumn();
      d.datasetId=item;
      d.datasetName = this.datasets.find(f=>f.datasetId==item).datasetName; // +" ["+item+"]";
      this._columns.push(d)
      this._columns = this._columns.concat(result[item]);
    }
   
    this.listOfCols = this._columns 
   
  }

  @Input('allFunctions') allFunctions: Array<any>;
  private _functions: Array<any>;
  @Input('functions')
  set functions(value: Array<any>) {
    this._functions = value;
    if (this.allFunctions) {
      this.allFunctions.forEach(af => {
        af.enabled = this._functions.some(f => f == af.type);
      });
    }
  }

  private _selectedFn: any;
  @Input('selectedFn')
  set selectedFn(value: string) {
    if (this.allFunctions) {
      this._selectedFn = this.allFunctions.find(af => af.type == value);
    }
  }
  @Output('onFnSelect') onFnSelect = new EventEmitter();
  @Output('onColSelect') onColSelect = new EventEmitter();

  public listOfCols: Array<any>;


  paramTextValue: any;
  constructor() {

  }

  ngAfterViewInit() {


  }

  onSelectedFn(item) {
    this._selectedFn = item;
    this.onFnSelect.emit(item.type);
  }

  onSelectedCol(item) {
    this.onColSelect.emit(item);
  }

  onClickedSearch(item) {
    this.onSearchClicked.emit(item);
  }

  paramTextValueChanged() {
    var searchPattern = new RegExp('^' + this.paramTextValue + '.*', 'i');
    var listOfCols = this._columns.filter(f => f.datasetName || searchPattern.test(f.columnName.replace(/\s*/g, "")));
    
    var res = [];
    this.datasets.forEach((r=>{
      var ll = listOfCols.filter(f=>f.datasetId==r.datasetId);
      if (ll.length>1){
        res = res.concat(ll)
      }
    }));
    this.listOfCols = res;
  }

}
