import { Injectable } from "@angular/core"
import { CanActivate, UrlTree, Router } from "@angular/router"
import { Observable } from "rxjs"
import { AuthGoogleService } from "@core/services/auth-google.service"

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthGoogleService,
    private router: Router,
  ) { }

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Implement your authentication logic here
    const isAuthenticated = this.authService.isAuthenticated()

    if (isAuthenticated) {
      return true
    } else {
      this.router.navigate(["/login"])
      return false
    }
  }
}
