import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, RouterModule } from "@angular/router"
import { TranslatePipe } from "@ngx-translate/core"
import { UserService } from "@core/services/user.service"
import { User } from "@models/user.model"
import { NgIf } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { UsuarioService } from "../usuario/usuario.service"

@Component({
  selector: "app-perfil",
  standalone: true,
  imports: [RouterModule, TranslatePipe, NgIf, FormsModule],
  templateUrl: "./perfil.component.html",
})
export class PerfilComponent implements OnInit {
  idUsuario: string | null = null
  user: User | null = null
  usuarioData: any

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.idUsuario = this.route.snapshot.paramMap.get("id")
    this.user = this.userService.getUser() || null
    console.log(this.user?.name)

    if (this.idUsuario) {
      this.getUsuario()
    }
  }

  getUsuario(): void {
    if (this.idUsuario) {
      this.usuarioService.getUsuario(this.idUsuario).subscribe({
        next: (data) => {
          this.usuarioData = data
          if (this.user) {
            this.user.wantsEmailNotifications = data.wants_emails
          }
        },
        error: (err) => {
          console.error("Error al obtener los datos del usuario:", err)
        },
      })
    }
  }

  toggleNotificaciones(): void {
    if (this.user && this.user.id) {
      const newValue = !this.user.wantsEmailNotifications
      const updatedData = { wants_emails: newValue }

      this.usuarioService.editUsuario(this.user.id, updatedData).subscribe({
        next: () => {
          if (this.user) {
            this.user.wantsEmailNotifications = newValue
          }
        },
        error: (err) => {
          console.error("Error al actualizar las notificaciones:", err)
        },
      })
    }
  }
}
