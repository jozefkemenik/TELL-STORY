import { AfterContentChecked, ApplicationRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';

import { DatasetService } from '../../dataset.service';
import { DatasetListResponse } from '../../models/dataset';

@Component({
  selector: 'app-dataset-dataset-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterContentChecked {
  private loading = true;
  // noinspection JSMismatchedCollectionQueryUpdate
  private datasets: DatasetListResponse = new DatasetListResponse();
  private pageLength = 10;
  private page = 1;
  private loadingMore = false;

  @ViewChild('header') header;
  @ViewChild('tableCard') tableCard;
  private tableCardHeight: number;

  constructor(
    private datasetService: DatasetService,
    private applicationRef: ApplicationRef
  ) {}

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
    this.datasetService.getDatasets(this.pageLength, this.page).then((datasets) => {
      this.datasets = datasets;
    }).finally(() => {
      this.loading = false;
    });
  }

  loadMore() {
    this.loadingMore = true;
    this.page++;
    this.applicationRef.tick();
    this.datasetService.getDatasets(this.pageLength, this.page).then((datasets) => {
      this.datasets.datasets = this.datasets.datasets.concat(datasets.datasets);
      this.datasets.totalRecords = datasets.totalRecords;
    }).finally(() => {
      this.loadingMore = false;
      this.applicationRef.tick();
    });
  }
}
