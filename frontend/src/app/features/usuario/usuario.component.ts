import { Component, OnInit, ViewChild } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { UsuarioService } from "./usuario.service"
import { ValoracionesComponent } from "../valoraciones/valoraciones.component"
import { CommonModule } from "@angular/common"
import { NewValoracionComponent } from "../new-valoracion/new-valoracion.component"
import { TranslatePipe } from "@ngx-translate/core"
import { UserService } from "@app/core/services/user.service"

@Component({
  selector: "app-usuario",
  imports: [
    CommonModule,
    ValoracionesComponent,
    NewValoracionComponent,
    TranslatePipe,
  ],
  templateUrl: "./usuario.component.html",
})
export class UsuarioComponent implements OnInit {
  idUsuario: string | null = null
  idUsuarioSesion: string | null = null
  usuarioData: any
  reputacionMedia = 0
  estrellas: string[] = []
  @ViewChild(ValoracionesComponent)
  valoracionesComponent!: ValoracionesComponent

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.idUsuario = this.route.snapshot.paramMap.get("id")
    this.idUsuarioSesion = this.userService.getUser()?.id ?? null

    if (this.idUsuario) {
      this.getUsuario()
    }
  }

  getUsuario(): void {
    if (this.idUsuario) {
      this.usuarioService.getUsuario(this.idUsuario).subscribe({
        next: (data) => {
          this.usuarioData = data
        },
        error: (err) => {
          console.error("Error al obtener los datos del usuario:", err)
        },
      })
    }
  }

  getEstrellas(nota: number): void {
    const estrellas = []
    if (nota < 0) nota = 0
    if (nota > 5) nota = 5

    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(nota)) {
        estrellas.push("fas fa-star")
      } else if (i < Math.floor(nota) + 0.5 && nota % 1 >= 0.5) {
        estrellas.push("fas fa-star-half-alt")
      } else {
        estrellas.push("far fa-star")
      }
    }
    this.estrellas = estrellas
  }

  onReputacionMediaCalculada(reputacion: number): void {
    this.reputacionMedia = reputacion
    this.getEstrellas(reputacion)
  }

  actualizarValoraciones(): void {
    if (this.valoracionesComponent) {
      this.valoracionesComponent.obtenerValoraciones()
    }
  }
}
