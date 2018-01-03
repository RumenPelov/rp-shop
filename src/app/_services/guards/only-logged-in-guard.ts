import {Injectable} from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, ActivatedRouteSnapshot} from "@angular/router";
import { AuthService } from "../auth.service";

@Injectable()
export class OnlyLoggedInGuard implements CanActivate{
    constructor(private auth: AuthService) {
    };

    canActivate() {
        console.log("OnlyLoggedInUsers");
        if (this.auth.loggedIn()) {
          return true;
        } else {
          window.alert("Please log in to view cart");
          return false;
        }
      }
}
