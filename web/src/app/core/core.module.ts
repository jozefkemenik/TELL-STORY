import { NgModule , APP_INITIALIZER, ModuleWithProviders} from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AuthGuard} from './auth/auth.guard';
import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { VerticalMenuComponent } from './components/menu/vertical-menu/vertical-menu.component';
import { SidenavComponent } from './components/sidenav/sidenav.component'
import { MenuService } from './components/menu/menu.service';
import { CookieService } from 'ngx-cookie-service';

export function MenuServiceFactory(menuService: MenuService) {
  return () => menuService.init();
}
@NgModule({
  declarations: [
    VerticalMenuComponent, 
    SidenavComponent,  
  ],
  imports: [  
    SharedModule,
    RouterModule,
  ],
  exports: [   
    SharedModule,
    SidenavComponent,
  ],
  providers: [   
  //  {provide: APP_INITIALIZER, useFactory: MenuServiceFactory, deps: [MenuService], multi: true }
],
 
})
export class CoreModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: CoreModule, providers: [AuthService, AuthGuard, CookieService,]};
  }
}





