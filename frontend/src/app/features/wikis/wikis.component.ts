import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { WikisService } from "./wikis.service"
import { Router } from "@angular/router"
import { BarraBusquedaComponent } from "@shared/components/barra-busqueda/barra-busqueda.component"
import { BotonEditarComponent } from "@shared/components/boton-editar/boton-editar.component"
import { TranslatePipe } from "@ngx-translate/core"
import { TraduccionesService } from "../traducciones/traducciones.service"
import { UserService } from "@app/core/services/user.service"
import { User } from "@app/models/user.model"

@Component({
  selector: "app-wikis",
  imports: [
    CommonModule,
    BarraBusquedaComponent,
    BotonEditarComponent,
    TranslatePipe,
  ],
  templateUrl: "./wikis.component.html",
})
export class WikisComponent implements OnInit {
  wikis: any[] = []
  wikisFiltradas: any[] = []
  textoBusqueda = ""
  role: User["role"] = "lector"

  constructor(
    private wikisService: WikisService,
    private router: Router,
    private traduccionesService: TraduccionesService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.role = this.userService.getUser()?.role ?? "lector"
    this.obtenerWikis()
  }

  obtenerWikis(nombre = ""): void {
    this.wikisService.getWikis(nombre).subscribe({
      next: (data) => {
        this.wikis = data
        this.wikisFiltradas = this.wikis
      },
      error: (err) => {
        console.error("Error al obtener las wikis:", err)
      },
    })
  }

  crearWiki() {
    console.log("Crear nueva wiki")

    this.router.navigate(["/new_wiki"])
  }

  onSearchTextChanged(textoBusqueda: string): void {
    this.textoBusqueda = textoBusqueda
    this.obtenerWikis(textoBusqueda)
  }

  handleWikiClick(wikiId: any) {
    console.log("Click en wiki:", wikiId)
    this.router.navigate(["/wiki/", wikiId])
  }

  borrarWiki(id: string): void {
    this.wikisService.deleteWiki(id).subscribe({
      next: () => {
        this.wikis = this.wikis.filter((wiki) => wiki.id !== id)
        this.wikisFiltradas = this.wikis
      },
      error: (err) => {
        console.error("Error al borrar la wiki:", err)
      },
    })
  }
  editarWiki(wikiId: string): void {
    console.log("Editar wiki con ID:", wikiId)
    // Lógica para redirigir o abrir un modal de edición
    this.router.navigate(["/wiki/", wikiId, "editar"])
  }
}
