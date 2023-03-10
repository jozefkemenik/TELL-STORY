import { ApplicationRef, Component, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WidgetGridService } from '../../../widgets/widget-grid/widget-grid.service';
import { Router } from '@angular/router';


import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpService } from '../../../shared/providers/http.service';

import { Dataset } from '../../models/datasets';

@Component({
  selector: 'app-modal-story',
  templateUrl: './modal-story.component.html',
  styleUrls: ['./modal-story.component.scss']
})
export class ModalStoryComponent implements OnInit {

  private loading = false;
  private modalRef: BsModalRef;
  private datasets: Array<any> = [];
  private selectedDatasets: object = {};
  private storyName: string;
  private wasPreselected = false;


  page = 1;
  size = 10;
  total=0;

  @ViewChild('template') template: TemplateRef<any>;

  constructor(
    private http: HttpService,
    private modalService: BsModalService,
    private wgs: WidgetGridService,
    private router: Router,
    private zone: NgZone,
    private applicationRef: ApplicationRef
  ) {
  }

  ngOnInit() {
    this.loading = true;

      this.modalRef = this.modalService.show(this.template, {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-xl'
      });
  
  }

  isDisabled() {
    return !this.storyName
      || (Object.keys(this.selectedDatasets)
        .filter(datasetId => this.selectedDatasets[datasetId])
        .length) === 0;
  }

  showStories() {
    this.modalRef.hide();
    this.router.navigate(['/stories']);
  }

  getDatasets(): Promise<boolean> {
    this.loading=true;
    return this.http.get('/widget/getuserdatasets', { limit: this.size, offset: (this.page-1)*this.size })
  .then(r => {
      this.datasets = this.datasets.concat(r.datasets as Array<Dataset>);

    // here u should remove preselection
    this.datasets.forEach(d => {
      if (d.datasetName == "Sample Telco") {
        this.wasPreselected =true;
        this.selectedDatasets[d.datasetId] = { selected: true };
      }
    });
    //end



      this.total=r.totalRecords;
      return true;
    }).finally(()=>{
      this.loading=false;
      // here u should remove preselection
      if(!this.wasPreselected && this.total>this.datasets.length){       
        this.onLoad(null);
      }
      //end
    });
  }

  onLoad(event){
    this.getDatasets();
    this.page++;
  }

  setStory() {
    this.modalRef.hide();
    this.zone.run(() => {
      this.wgs.createNewStory(this.storyName, this.datasets.filter(r => this.selectedDatasets[r.datasetId])).finally(() => {
      });
    });
  }

  selectChange($event) {
    this.selectedDatasets[$event.datasetId] = $event.selected;
    this.applicationRef.tick();
  }
}
