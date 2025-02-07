import { Component, OnInit } from "@angular/core"
import { TraduccionesService } from "./traducciones.service"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-traducciones",
  imports: [FormsModule],
  standalone: true,
  templateUrl: "./traducciones.component.html",
})
export class TraduccionesComponent implements OnInit {
  idiomasDisponibles: { code: string; name: string }[] = []
  idiomaActual = "es"

  constructor(private traduccionesService: TraduccionesService) {}

  ngOnInit(): void {
    const idiomaGuardado = localStorage.getItem("idiomaSeleccionado")
    if (idiomaGuardado) {
      this.idiomaActual = idiomaGuardado
    }

    this.traduccionesService.obtenerIdiomasDisponibles().then((idiomas) => {
      this.idiomasDisponibles = idiomas

      this.traduccionesService.cargarDesdeCache(this.idiomaActual)

      this.traduccionesService.traducirYActualizar(this.idiomaActual)
    })
  }

  cambiarIdioma(_event: Event): void {
    localStorage.setItem("idiomaSeleccionado", this.idiomaActual)

    this.traduccionesService.traducirYActualizar(this.idiomaActual)
  }
}
