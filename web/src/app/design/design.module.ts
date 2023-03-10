import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignRoutingModule } from './design-routing.module';
import { EditComponent } from './pages/edit/edit.component';

import { CoreModule, } from '../core/core.module';


import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import {WidgetsModule} from '../widgets/widgets.module'
import {DragDropModule} from '@angular/cdk/drag-drop';
import {HttpService} from '../shared/providers/http.service';
import { ModalStoryComponent } from './components/modal-story/modal-story.component'



@NgModule({
  imports: [
    CommonModule,    
    DesignRoutingModule , 
    PerfectScrollbarModule,
    CoreModule,
    WidgetsModule,
    DragDropModule,
  ],
  declarations: [
    EditComponent,
    ModalStoryComponent,

  ],
  providers:[
    HttpService
  ],
  entryComponents: [
  ],
  exports: []
})
export class DesignModule { }
