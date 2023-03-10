import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { DetailComponent } from './pages/detail/detail.component';
import { CreateComponent } from './pages/create/create.component';

const routes: Routes = [
    {
      path: 'list',
      component: ListComponent
    },
    {
      path: 'detail/:id',
      component: DetailComponent
    },
    {
      path: 'create',
      component: CreateComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DatasetRoutingModule {
}
