import { Component } from '@angular/core';
import { Dataset } from '../../../dataset/models/dataset';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-styles',
  templateUrl: './styles.component.html',
  styleUrls: ['./styles.component.scss'],
})
export class StylesComponent {

  switchValue = true;
  inputValue1 = '';
  inputValue2 = '';
  inputValue3 = '';
  searchValue = '';
  checkBox = false;

  datasetListDatasets: Array<Dataset> = [1,2,3,4,5,6,7,8,9,10].map((id) => {
    const dataset = new Dataset();
    dataset.datasetId = id;
    dataset.datasetUID = UUID.UUID();
    dataset.datasetName = 'Dataset ' + id;
    dataset.createdDate = new Date();
    dataset.rowsCount = 1024;
    dataset.columnsCount = 8;
    return dataset;
  });

  datasetListSelectedDatasets: Array<boolean> = [];
}
