import { Component, OnInit } from "@angular/core"
import { NotificacionesComponent } from "@features/notificaciones/notificaciones.component.js"
import { TranslatePipe } from "@ngx-translate/core"
import { TraduccionesComponent } from "@features/traducciones/traducciones.component.js"
import { Router, RouterModule } from "@angular/router"
import { AuthGoogleService } from "@core/services/auth-google.service.js"
import { UserService } from "@core/services/user.service.js"
import { User } from "@app/models/user.model"
import { NgIf } from "@angular/common"

@Component({
  selector: "app-barra-navegacion",
  standalone: true,
  imports: [
    NotificacionesComponent,
    TranslatePipe,
    TraduccionesComponent,
    RouterModule,
  ],
  templateUrl: "./barra-navegacion.component.html",
})
export class BarraNavegacionComponent implements OnInit {
  role: User["role"] = "lector"
  constructor(
    private authService: AuthGoogleService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.role = this.userService.getUser()?.role ?? "lector"
  }

  usuarioEnSesion() {
    const user = this.userService.getUser()
    return user !== null && user.id !== "";
  }

  usuarioEsAdmin() {
    return this.role === 'admin'
  }

  logOut() {
    this.authService.logout()
    this.userService.clearUser()
    this.router.navigate(["/login"])
  }

  irAPerfil() {
    this.router.navigate(["/perfil/" + this.userService.getUser()?.id])
  }

  irAAdministrarUsuarios() {
    this.router.navigate(["/administrar_usuarios"])
  }

  irALogIn() {
    this.router.navigate(["/login"])
  }
}
