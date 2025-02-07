import { Component, EventEmitter, Output } from "@angular/core"
import { TranslatePipe } from "@ngx-translate/core"

@Component({
  selector: "app-boton-editar",
  imports: [TranslatePipe],
  templateUrl: "./boton-editar.component.html",
  styleUrls: ["./boton-editar.component.scss"],
})
export class BotonEditarComponent {
  // Evento que se emite cuando el botón es clicado
  @Output() editar: EventEmitter<void> = new EventEmitter<void>()

  // Método que se ejecuta al hacer clic
  onClick(): void {
    console.log("Botón Editar clicado")
    this.editar.emit() // Emite el evento al componente padre
  }
}
