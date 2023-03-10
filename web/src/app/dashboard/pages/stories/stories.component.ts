import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpService } from '../../../shared/providers/http.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class StoriesComponent implements OnInit {

  page = 1;
  size = 20;
  total=0;

  public stories: Array<any>=[];
  loading = false;
  constructor(private http: HttpService, private router: Router) {

  }

  ngOnInit() {

  }

  

  
  createNewStory() {
    this.router.navigate(['/design']);
  }
  showStory(id) {
    this.router.navigate(['/design'], { queryParams: { storyid: id } })
  }

  private loadStories() {
    this.loading = true;
    this.http.get('/story/loadStories', { limit: this.size, offset: (this.page-1)*this.size })
      //  
      .then((r) => {
        if (r) {
           this.stories = this.stories.concat(r.stories);
           this.total=r.totalRecords;
        } 
      }).finally(() => {
       
        this.loading = false;
      });
  }

  trackByFunction(index,item){
    if(!item) return null;
    return item.id;
  }

  onLoad(e){
      this.loadStories();
      this.page++; 
  }

}









