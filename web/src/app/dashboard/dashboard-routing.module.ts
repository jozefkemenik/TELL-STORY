import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { StylesComponent } from './pages/styles/styles.component';
import { StoriesComponent } from './pages/stories/stories.component';



const routes: Routes = [
 {path: '', component: HomeComponent},
 {path:  'styles',  component: StylesComponent },
 { path: 'stories', component: StoriesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
