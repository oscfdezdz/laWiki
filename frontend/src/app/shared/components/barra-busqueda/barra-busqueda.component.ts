import { Component, EventEmitter, Output } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { TranslatePipe } from "@ngx-translate/core"

@Component({
  selector: "app-barra-busqueda",
  imports: [FormsModule, TranslatePipe],
  templateUrl: "./barra-busqueda.component.html",
})
export class BarraBusquedaComponent {
  textoBusqueda = ""
  private timeoutBusqueda: any

  @Output()
  busqueda = new EventEmitter<string>()

  onSearchChange() {
    if (this.timeoutBusqueda) {
      clearTimeout(this.timeoutBusqueda)
    }

    this.timeoutBusqueda = setTimeout(() => {
      this.busqueda.emit(this.textoBusqueda)
    }, 250)
  }
}
