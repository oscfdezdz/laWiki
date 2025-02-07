import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { HistorialVersionesService } from "./historial-versiones.service"
import { TranslatePipe } from "@ngx-translate/core"

@Component({
  selector: "app-historial-versiones",
  imports: [TranslatePipe, RouterModule],
  templateUrl: "./historial-versiones.component.html",
})
export class HistorialVersionesComponent implements OnInit {
  entrada: any = {}
  versiones: any[] = []

  constructor(
    private historialVersionesService: HistorialVersionesService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const entradaId = this.route.snapshot.paramMap.get("id")!

    this.historialVersionesService.getEntradaById(entradaId).subscribe({
      next: (data) => {
        this.entrada = data
        console.log(data)
      },
      error: (err) => {
        console.error("Error al obtener la entrada:", err)
      },
    })

    this.historialVersionesService
      .getVersionesByEntradaId(entradaId)
      .subscribe({
        next: (data) => {
          this.versiones = data
          this.getUsuarios(data)
        },
        error: (err) => {
          console.error("Error al obtener las versiones:", err)
        },
      })
  }

  getUsuarios(data: any[]): void {
    console.log("getUsuarios")
    for (const version of data) {
      console.log(version)
      this.historialVersionesService
        .getUsuarioById(version["idUsuario"])
        .subscribe({
          next: (data: any) => {
            version["nombreUsuario"] = data["name"]
            version["profilePicture"] = data["profile_picture"]
          },
          error: (err: any) => {
            console.error("Error al obtener el usuario:", err)
          },
        })
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  restaurarVersion(version: any): void {
    const fechaActual = new Date().toISOString()
    this.historialVersionesService
      .updateFechaEdicion(version._id, fechaActual)
      .subscribe({
        next: (data) => {
          console.log("Fecha de edición actualizada:", data)
          version.fechaEdicion = fechaActual
          this.router.navigate([this.router.url.replace("/historial", "")])
        },
        error: (err) => {
          console.error("Error al actualizar la fecha de edición:", err)
        },
      })
  }
}
