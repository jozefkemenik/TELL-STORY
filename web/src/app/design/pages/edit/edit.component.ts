import { Component, OnInit, ViewChild, ViewContainerRef, TemplateRef, AfterViewInit, ViewEncapsulation  } from '@angular/core';

import { WidgetControlManifest } from '../../../widgets/models/wc-manifest.model';
import { WidgetContent } from '../../../widgets/models/w.model';
import { WidgetGridService } from '../../../widgets/widget-grid/widget-grid.service'
import { ActivatedRoute, Router } from '@angular/router';


import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpService } from '../../../shared/providers/http.service';

import { Dataset } from '../../models/datasets'

import { filter } from "rxjs/operators";
import { AuthService } from '../../../core/auth/auth.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  encapsulation: ViewEncapsulation.None
 
})
export class EditComponent implements OnInit, AfterViewInit {

  public wcManifests: Array<WidgetControlManifest> = [];
  public get widgets():Array<any>
  {
    return  this.wgs.gridItems;
  }
  public loading=false;
  public showModal=false;

 

  private loadingDataset = false;


  constructor(private router:Router,
              private wgs:WidgetGridService,
              private route: ActivatedRoute,
              private http: HttpService, 
              private modalService: BsModalService,
              private authService: AuthService,
             ) { 
    }

  ngOnInit() {
    this.wgs.clear();
    this.route.queryParams.subscribe((params)=>{
      if(params.storyid){
        this.showStory(params.storyid);
      }
      else{
        this.createStory();
      }
    })
    
   
  }



  showDashboard(){
    this.router.navigate(['/stories'])
  }


  createStory() {
    this.showModal= true;  
  }
  

  showStory(id){
    this.loading = true;
       
        this.wgs.showStory(id).finally(()=>{
          this.loading = false;
        });
     
  }


  logout(){
    this.authService.logout();
  }



  ngAfterViewInit() {
   
  }


 


//modal
 

 


}
