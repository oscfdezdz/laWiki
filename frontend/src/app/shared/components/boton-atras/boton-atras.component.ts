import { Component, Input } from "@angular/core"
import { Router } from "@angular/router"
import { TranslatePipe } from "@ngx-translate/core"

@Component({
  selector: "app-boton-atras",
  imports: [TranslatePipe],
  templateUrl: "./boton-atras.component.html",
})
export class BotonAtrasComponent {
  @Input()
  ruta = "/"
  constructor(private router: Router) { }
  volverAtras() {
    this.router.navigate([this.ruta])
  }
}
