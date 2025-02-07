import { Component, effect } from "@angular/core"
import { Router } from "@angular/router"
import { AuthGoogleService } from "@core/services/auth-google.service"
import { User } from "@models/user.model"
import { UserService } from "@core/services/user.service"
import { TranslatePipe } from "@ngx-translate/core"

@Component({
  selector: "app-bridge",
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: "./bridge.component.html",
})
export class BridgeComponent {
  profile: any
  constructor(
    private authService: AuthGoogleService,
    private router: Router,
    private userService: UserService,
  ) {
    this.profile = this.authService.profile
    effect(() => {
      if (this.profile != null) {
        console.log("Profile: ", this.profile())
        console.log("auth: ", this.authService.getRawProfile())
        const { name, email, sub, picture } = this.profile()
        const user: User = {
          id: sub,
          name: name,
          email: email,
          role: "lector", //lector por defecto
          profilePicture: picture,
          wantsEmailNotifications: true,
          oauth: {
            access_token: this.authService.getToken(),
            expires_in: this.authService.getExpiresIn(),
            refresh_token: this.authService.getRefreshToken(),
            expires_in_refresh: this.authService.getExpiresInRefresh(),
          },
        }
        this.userService.saveUserToDb(user).subscribe({
          next: (response) => {
            const {
              googleId,
              name,
              email,
              profile_picture,
              access_token,
              expires_in,
              role,
              wants_emails,
            } = response.detail

            const user: User = {
              id: googleId,
              name: name,
              email: email,
              role: role,
              profilePicture: profile_picture,
              wantsEmailNotifications: wants_emails,
              oauth: {
                access_token: access_token,
                expires_in: expires_in,
              },
            }
            this.userService.setUser(user)
            this.router.navigate(["/"])
          },
          error: (err) => {
            console.error(
              "Error al guardar el usuario en la base de datos:",
              err,
            )
            this.userService.setUser(user)
            this.router.navigate(["/"])
          },
        })
      }
    })
  }
}
