import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
} from "@angular/router";
import { catchError, map } from "rxjs/operators";
import { ApiService } from "../api.service";

@Injectable({
	providedIn: "root",
})
export class AdminGuard implements CanActivate {
	constructor(
		private readonly api: ApiService,
		private readonly router: Router,
	) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		return this.api.getAdminPasswordVerified().pipe(
			map(res => res.success),
			catchError(async error => {
				// alert("No");
				return this.router.parseUrl("/");
			}),
		);
	}
}
