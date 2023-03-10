import { Component, OnInit, ViewEncapsulation, AfterContentChecked, ViewChild, HostListener, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DatasetService } from '../../../dataset/dataset.service';
import { Dataset, DatasetListResponse } from '../../../dataset/models/dataset';

import TimeAgo from 'javascript-time-ago';
import TimeAgoEn from 'javascript-time-ago/locale/en';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpService } from '../../../shared/providers/http.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})


export class HomeComponent implements OnInit, AfterContentChecked {

  public checkStoryExist = false;
  public loadingDataSets = true;
  public loadingStories = true;
  // noinspection JSMismatchedCollectionQueryUpdate
  private datasets: DatasetListResponse = new DatasetListResponse();
  private pageLength = 10;
  private page = 1;
  private size = 4;
  private total = 0;
  public stories: Array<any> = [];
  private _stories : Array<any> = [];
  private loadingMore = false;

  @ViewChild('header') header;
  @ViewChild('tableCard') tableCard;
  private tableCardHeight: number;

  constructor(
    private router: Router,
    private datasetService: DatasetService,
    private http: HttpService,
    private zone: NgZone
  ) {
    TimeAgo.addLocale(TimeAgoEn);
  }

  //---------------- start Stories -----------------------------------

  createNewStory() {
    this.router.navigate(['/design']);
  }

  showStory(id: any) {
    this.router.navigate(['/design'], { queryParams: { storyid: id } })
  }

  private loadStories() {
    this.http.get('/story/loadStories', { limit: this.size, offset: (this.page - 1) * this.size })
      .then((r) => {
        if (r) {
          this._stories = this._stories.concat(r.stories);
          this.total = r.totalRecords;
          this.checkStoryExist = this.total > 0;
          this.updateStories();
        }
      }).finally(() => {
        this.loadingStories = false;
      });
  }

  trackByFunction(index, item) {
    if (!item) return null;
    return item.id;
  }

  //---------------- end Stories -------------------------------------



  // --------------- start datasets ----------------------------------

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

      this.updateStories();
  }

  ngAfterContentChecked() {
    this.onResize({ target: window });
  }

  ngOnInit() {
    this.loadStories();

    this.datasetService.getDatasets(this.pageLength, this.page).then((datasets) => {
      this.datasets = datasets;
    }).finally(() => {
      this.loadingDataSets = false;
    });
  }

  LoadDatasets() {

  }

  updateStories(){
    var width = window.innerWidth;
    if(!this._stories.length){
      return;
    }
    if(width>1400){
      this.stories =  this._stories.slice(0, 4);
      return
    }
    if(width>1025){
      this.stories =  this._stories.slice(0, 3);
      return
    }
    if(width>770){
      this.stories =  this._stories.slice(0, 2);
      return;
    }
    if(width>500){
      this.stories =  this._stories.slice(0, 1);
      return;
    }
    this.stories = [];
    // if(width>300){
    //   this.stories =  this._stories.slice(0, 0);
    //   return;
    // }
  
  }

  loadMore() {
    this.loadingMore = true;
    this.page++;
    this.datasetService.getDatasets(this.pageLength, this.page).then((datasets) => {
      this.datasets.datasets = this.datasets.datasets.concat(datasets.datasets);
      this.datasets.totalRecords = datasets.totalRecords;
    }).finally(() => {
      this.loadingMore = false;
    });
  }
 

  // --------------- end datasets ----------------------------------

}
