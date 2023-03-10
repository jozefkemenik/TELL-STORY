import { NgModule } from '@angular/core';
import { Routes, RouterModule,  } from '@angular/router';
import { EditComponent } from './pages/edit/edit.component';
import { MenuService } from '../core/components/menu/menu.service';


const routes: Routes = [
  {
    path: '',
    component: EditComponent,
     resolve:{
      routeResolver:MenuService
     }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignRoutingModule { }
