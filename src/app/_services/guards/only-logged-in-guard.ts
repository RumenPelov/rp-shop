import {Injectable} from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, ActivatedRouteSnapshot} from "@angular/router";
import { AuthService } from "../auth.service";

@Injectable()
export class OnlyLoggedInGuard implements CanActivate{
    constructor(private auth: AuthService) {
    };

    canActivate() {
      if (this.auth.loggedIn()) {
        return true;
      } else {
        console.log("OnlyLoggedInUsers");
        window.alert("Please log in to view cart");
        return false;
      }
    }
}
