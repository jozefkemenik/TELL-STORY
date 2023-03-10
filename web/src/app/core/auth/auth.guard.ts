import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { map } from "rxjs/operators"
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: AuthService, private router: Router) { }

  canLoad(route: Route) {
    return this.authService.isAuthenticated.pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true;
        }
        let url = `/${route.path}`;
        this.router.navigate(['/login'], { queryParams: { redirectTo: url } });
        return isLoggedIn;
      })
    );
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.isAuthenticated.pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true;
        }
        this.router.navigate(['/login'], { queryParams: { redirectTo: state.url } });
        return isLoggedIn;
      })
    );
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }
}