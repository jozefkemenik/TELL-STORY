import { Component } from '@angular/core';
import { AuthService } from './core/auth/auth.service';
import { Event as RouterEvent, Router, RouteConfigLoadEnd, RouteConfigLoadStart, Route, NavigationStart, NavigationEnd } from "@angular/router";

const menusList = [
  {
    title: 't_Stories',
    url: '/stories',
    children: null,
  },
  {
    title: 't_Datasets',
    url: '/dataset/list',
    children: null,
  },
  {
    title: 't_Dbconsole',
    url: '/dbconsole',
    children: null,
  },
  {
    title: 't_Styles',
    url: '/styles',
    children: null,
  },
];
const urlHiddenMenu = ['/design','/login','/register'];


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public menus = menusList;

  public showMenu = false;

  public isShowingRouteLoadIndicator = false;
  private asyncLoadCount = 0;

  constructor(private authService: AuthService, private router: Router) {
    this.registerLazyIndicator();
  }

  logout() {
    this.authService.logout();
  }

  registerLazyIndicator() {
    this.router.events.subscribe(
      ( event: RouterEvent ) : void => {
          if ( event instanceof NavigationStart ) {
              this.isShowingRouteLoadIndicator =true;
          } else if ( event instanceof NavigationEnd ) {
              this.isShowingRouteLoadIndicator = false;
              if(this.router.url){
                this.showMenu= !urlHiddenMenu.some(r=> this.router.url.toLowerCase().indexOf(r)>-1);
              }
          }
          //this.isShowingRouteLoadIndicator = !! this.asyncLoadCount;
      }
    );
  }

}









