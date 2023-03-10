import { AfterContentChecked, Component, HostListener, OnInit, ViewChild } from '@angular/core';

import { DatasetService } from '../../dataset.service';
import { DatasetDetail } from '../../models/dataset';
import { ActivatedRoute } from '@angular/router';
import { QueryResult } from '../../models/query';
import { QueryService } from '../../query.service';
import { TableOptions } from '../../../shared/models/table-options.model';

@Component({
  selector: 'app-dataset-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, AfterContentChecked {
  private dbTableOptions = new TableOptions(
    true,
    true,
    true,
    true
  );
  private dbTableLoadMoreEnable = true;
  private dbTableLoadingMore = false;
  private listTableOptions = new TableOptions(
    false,
    false,
    false,
    false
  );

  private loading = true;
  private tableLoading = false;
  private datasetDetail: DatasetDetail = null;
  private tableData: QueryResult = null;
  private tableView = false;
  private pageLength = 10;
  private page = 1;
  private orderColumn: string = null;
  private orderDirection: string = null;
  private tableDataError: string|boolean = null;
  private datasetDetailError: string = null;

  @ViewChild('header') header;
  @ViewChild('tableCard') tableCard;
  private tableCardHeight: number;

  constructor(
    private route: ActivatedRoute,
    private datasetService: DatasetService,
    private queryService: QueryService
  ) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const headingRowStyle = window.getComputedStyle(this.header.nativeElement);
    const headingRowHeight = parseFloat(headingRowStyle.marginBottom)
      + parseFloat(headingRowStyle.marginTop)
      + this.header.nativeElement.offsetHeight;
    this.tableCardHeight = event.target.innerHeight
      - document.getElementsByClassName('top-menu-bar')[0].clientHeight
      - headingRowHeight
      - parseFloat(window.getComputedStyle(this.tableCard.nativeElement).marginBottom)
      - 2;
  }

  ngAfterContentChecked() {
    this.onResize({target: window});
  }


  ngOnInit() {
    this.datasetService.getDatasetDetail(this.route.snapshot.paramMap.get('id'))
      .then((datasetDetail) => {
        this.datasetDetail = datasetDetail;
        if ((this.datasetDetail.columnsCount > 0) && (this.datasetDetail.rowsCount > 0)) {
          this.loadTableData();
        }
      })
      .catch((error) => {
        this.datasetDetailError = error.error ? error.error : error.message;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  loadTableData(): void {
    this.tableLoading = true;
    this.queryService.getDatasetTableData(
      this.datasetDetail.datasetUID,
      this.pageLength * this.page,
      1,
      this.orderColumn,
      this.orderDirection
    )
      .then((tableData) => {
        this.tableData = tableData;
      })
      .catch((error) => {
        this.tableDataError = error.error ? error.error : error.message;
        this.tableDataError = typeof this.tableDataError !== 'string' ? true : this.tableDataError;
        this.tableData = null;
      })
      .finally(() => {
        this.tableLoading = false;
      });
  }

  loadMoreTableData(): void {
    this.page++;
    this.dbTableLoadingMore = true;
    this.queryService.getDatasetTableData(
      this.datasetDetail.datasetUID,
      this.pageLength,
      this.page,
      this.orderColumn,
      this.orderDirection
    )
      .then((tableData) => {
        if (tableData.data[Object.keys(tableData.data)[0]].length === 0) {
          this.dbTableLoadMoreEnable = false;
        } else {
          Object.keys(this.tableData.data).forEach((key) => {
            this.tableData.data[key] = this.tableData.data[key].concat(tableData.data[key]);
          });
        }
      })
      .catch((error) => {
        this.tableDataError = error.error ? error.error : error.message;
        this.tableDataError = typeof this.tableDataError !== 'string' ? true : this.tableDataError;
        this.tableData = null;
      })
      .finally(() => {
        this.dbTableLoadingMore = false;
      });
  }

  changeOrder(order): void {
    this.orderColumn = order.column;
    this.orderDirection = order.direction;
    this.loadTableData();
  }

  getDbTableHeaders(): Array<string> {
    return (this.datasetDetail.datasetColumns.length > 0)
      ? this.datasetDetail.datasetColumns.map(column => column.columnName)
      : [];
  }

  getDbTableKeys(): Array<string> {
    return this.getDbTableHeaders().map(header => this.datasetDetail.datasetUID + '.' + header);
  }

  getDatasetColumnDatatype(columnHeader: string): string {
    return this.datasetDetail.datasetColumns.filter(datasetColumn => (datasetColumn.columnName === columnHeader))[0].columnType;
  }
}
