import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DBConsoleComponent} from './pages/dbconsole.component';


const routes: Routes = [
  {
    path: '',
    component: DBConsoleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DBConsoleRoutingModule { }
