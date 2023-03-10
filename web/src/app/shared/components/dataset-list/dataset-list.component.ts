import {Component, Input, Output, EventEmitter} from '@angular/core';
import { Dataset } from '../../../dataset/models/dataset';
import { TableOptions } from '../../models/table-options.model';
import { Router } from '@angular/router';
import TimeAgo from 'javascript-time-ago';
import TimeAgoEn from 'javascript-time-ago/locale/en';

@Component({
  selector: 'app-dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.scss']
})
export class DatasetListComponent {
  @Input()
  private loading: boolean;

  @Input()
  private datasets: Array<Dataset>;

  @Input()
  private loadingMore: boolean;

  @Input()
  private loadingMoreEnabled: boolean;

  @Input()
  private actionButton = false;

  @Input()
  private selectable = false;

  @Input()
  private selectWithRowClick = false;

  @Input()
  private selectedDatasets: object = {};

  @Input()
  private showUuid = false;

  @Output()
  private loadMore = new EventEmitter();

  @Output()
  private selectChange = new EventEmitter();

  private listTableOptions = new TableOptions(
    false,
    false,
    false,
    true,
    true
  );

  private timeAgoFormatter: TimeAgo;

  constructor(private router: Router) {
    TimeAgo.addLocale(TimeAgoEn);
    this.timeAgoFormatter = new TimeAgo('en-US');
  }

  getTableKeys() {
    return (this.selectable ? ['checkbox'] : [])
      .concat(['typeIcon', 'name'])
      .concat(this.showUuid ? ['uuid'] : [])
      .concat(['rows', 'columns', 'size']);
  }

  generateRowsCountString(dataset: Dataset) {
    return (dataset.rowsCount >= 1000000000)
      ? ((Math.round(dataset.rowsCount / 1000000) / 1000) + 'G')
      : (
        (dataset.rowsCount >= 1000000)
          ? ((Math.round(dataset.rowsCount / 1000) / 1000) + 'M')
          : (
            (dataset.rowsCount >= 1000)
              ? ((dataset.rowsCount / 1000) + 'K')
              : dataset.rowsCount
          )
      );
  }

  generateCreatedTimeString(dataset: Dataset) {
    return this.timeAgoFormatter.format(new Date(dataset.createdDate));
  }

  selectedChange(datasetId: string, selected: boolean, source: string) {
    if (
      this.selectable
      && (
        (this.selectWithRowClick && (source === 'row'))
        || (!this.selectWithRowClick && (source === 'checkbox'))
      )
    ) {
      this.selectChange.emit({
        datasetId,
        selected
      });
    }
  }

  goToDatasetDetail(dataset: Dataset) {
    this.router.navigate(['/dataset/detail', dataset.datasetId]);
  }
}
