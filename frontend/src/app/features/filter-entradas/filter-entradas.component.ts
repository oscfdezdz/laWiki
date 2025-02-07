import { Component, EventEmitter, Output } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { TranslatePipe } from "@ngx-translate/core"

@Component({
  selector: "app-filter-entradas",
  imports: [FormsModule, TranslatePipe],
  templateUrl: "./filter-entradas.component.html",
})
export class FilterEntradasComponent {
  filtro = {
    nombre: "",
    autor: "",
    fechaCreacion: "",
  }

  @Output()
  filtroAplicado = new EventEmitter<any>()

  handleEntradasFilter(): void {
    this.filtroAplicado.emit(this.filtro)
  }

  resetFilters(): void {
    this.filtro = {
      nombre: "",
      autor: "",
      fechaCreacion: "",
    }
    this.handleEntradasFilter()
  }

  onEnter(event: any): void {
    event.preventDefault()
    this.handleEntradasFilter()
  }
}
