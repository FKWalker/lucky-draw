import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {

    const session = await this.authService.getSession();

    if (session) {
      // User is authenticated
      return true;
    }

    // User is not authenticated
    return this.router.createUrlTree(
      ['/sign-in'],
      {
        queryParams: {
          returnUrl: state.url
        }
      }
    );
  }
}
