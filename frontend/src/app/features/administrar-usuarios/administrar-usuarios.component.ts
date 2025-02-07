import { Component, OnInit } from "@angular/core"
import { RouterModule } from "@angular/router"
import { AdministrarUsuariosService } from "./administrar-usuarios.service"
import { TranslatePipe } from "@ngx-translate/core"
import { UserService } from "@app/core/services/user.service"

@Component({
  selector: "app-administrar-usuarios",
  imports: [TranslatePipe, RouterModule],
  templateUrl: "./administrar-usuarios.component.html",
})
export class AdministrarUsuariosComponent implements OnInit {
  usuarios: any[] = []
  user: any

  constructor(
    private administrarUsuariosService: AdministrarUsuariosService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUser()
    console.log(this.user)

    this.administrarUsuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data
      },
      error: (err) => {
        console.error("Error al obtener los usuarios:", err)
      },
    })
  }

  onClickDropdown(index: number): void {
    document.getElementById("dropdown"+index)?.classList.toggle("hidden");
  }

  onClickRol(usuario: any, rol: string): void {
    usuario.role = rol
    this.administrarUsuariosService.cambiarRol(usuario.googleId, rol).subscribe({
      next: () => {
        console.log("Rol cambiado con éxito")
      },
      error: (err) => {
        console.error("Error al cambiar el rol del usuario:", err)
      },
    })
  }

  onClickBorrar(id: string): void {
    this.administrarUsuariosService.borrarUsuario(id).subscribe({
      next: () => {
        console.log("Usuario borrado con éxito")
        this.usuarios = this.usuarios.filter((usuario) => usuario.googleId !== id)
      },
      error: (err) => {
        console.error("Error al borrar el usuario:", err)
      },
    })
  }
}
