import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CoreModule } from '../core/core.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HomeComponent } from './pages/home/home.component';
import { StylesComponent } from './pages/styles/styles.component';
import { StoriesComponent } from './pages/stories/stories.component';
import { AtomsCardComponent } from './components/atoms-card/atoms-card.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,

    CoreModule,
    DragDropModule
  ],
  declarations: [
    HomeComponent,
    StylesComponent,
    StoriesComponent,
    AtomsCardComponent
  ],
  entryComponents: [
  ],
  exports: []
})
export class DashboardModule { }
