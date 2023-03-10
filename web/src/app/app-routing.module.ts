import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '',         loadChildren: './dashboard/dashboard.module#DashboardModule', canActivateChild: [AuthGuard]},
  { path: 'design', loadChildren: './design/design.module#DesignModule', canActivateChild: [AuthGuard] },
  { path: 'dbconsole', loadChildren: './dbconsole/dbconsole.module#DBConsoleModule', canActivateChild: [AuthGuard] },
  // { path: 'edit',     loadChildren: './edit/edit.module#EditModule',                canActivateChild: [AuthGuard]},
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterModule' },
  { path: 'dataset', loadChildren: './dataset/dataset.module#DatasetModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})

export class AppRoutingModule { }
