import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { EntradaService } from "./entrada.service"
import { CommonModule } from "@angular/common"
import { VersionComponent } from "../version/version.component"
import { BotonEditarComponent } from "@shared/components/boton-editar/boton-editar.component"
import { ComentariosComponent } from "../comentarios/comentarios.component"
import { MapasService } from "../mapas/mapas.service"
import { MapasComponent } from "../mapas/mapas.component"
import { FormBuilder, FormGroup } from "@angular/forms"
import { UsuarioService } from "../usuario/usuario.service"
import { TranslatePipe, TranslateService } from "@ngx-translate/core"
import { TraduccionesService } from "../traducciones/traducciones.service"
import { UserService } from "@app/core/services/user.service"
import { User } from "@app/models/user.model"
import { VersionService } from "../version/version.service"
import { NewVersionComponent } from "../new-version/new-version.component"
import { Subscription } from "rxjs"

@Component({
  selector: "app-entrada",
  imports: [
    CommonModule,
    VersionComponent,
    BotonEditarComponent,
    ComentariosComponent,
    MapasComponent,
    RouterModule,
    TranslatePipe,
  ],
  templateUrl: "./entrada.component.html",
})
export class EntradaComponent implements OnInit, OnDestroy {
  entradaForm: FormGroup
  entradaId!: string
  idWiki!: string
  versionActualId!: string
  nombreEntrada = ""
  nombreUsuario = ""
  idUsuario = ""
  lang = ""
  fechaCreacion: Date = new Date()
  tieneMapa = false
  role: User["role"] = "lector"
  mostrarBotonTraducir = false
  private langSubscription?: Subscription

  @ViewChild(MapasComponent, { static: false }) mapasComponent!: MapasComponent
  @ViewChild(NewVersionComponent) newVersionComponent!: NewVersionComponent

  constructor(
    private entradaService: EntradaService,
    private usuarioService: UsuarioService,
    private mapasService: MapasService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private traduccionesService: TraduccionesService,
    private userService: UserService,
    private translateService: TranslateService,
    private versionService: VersionService,
  ) {
    this.entradaForm = this.fb.group({
      ubicacion: this.fb.group({
        lat: [""],
        lon: [""],
      }),
    })
  }

  ngOnInit(): void {
    this.role = this.userService.getUser()?.role ?? "lector"
    this.entradaId = this.route.snapshot.paramMap.get("id")!
    this.cargarEntrada()
    this.cargarMapa()

    this.langSubscription = this.translateService.onLangChange.subscribe(() => {
      this.mostrarBotonTraducir =
        this.lang !== this.translateService.currentLang
    })
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe()
    }
  }

  verVersiones() {
    this.router.navigate([`/entrada/${this.entradaId}/historial/`])
  }

  editarEntrada() {
    this.router.navigate([`/entrada/${this.entradaId}/editar`])
  }

  async traducirEntrada() {
    try {
      const version = await this.versionService
        .getVersionById(this.versionActualId)
        .toPromise()

      const nombreEntradaTraducido =
        await this.traduccionesService.traducirTextoDirecto(this.nombreEntrada)
      const contenidoVersionTraducido =
        await this.traduccionesService.traducirTextoDirecto(version.contenido)

      const ubicacion = this.entradaForm.get("ubicacion")?.value

      this.router.navigate([`/wiki/${this.idWiki}/new_entrada`], {
        queryParams: {
          nombreEntrada: nombreEntradaTraducido,
          contenidoVersion: contenidoVersionTraducido,
          lat: ubicacion?.lat || "",
          lon: ubicacion?.lon || "",
        },
      })
    } catch (err) {
      console.error("Error al traducir la entrada o al obtener el mapa:", err)
    }
  }

  private cargarEntrada() {
    this.entradaService.getEntradaById(this.entradaId).subscribe({
      next: (data) => {
        this.idWiki = data["idWiki"]
        this.versionActualId = data["idVersionActual"]
        this.nombreEntrada = data["nombre"]
        this.idUsuario = data["idUsuario"]
        this.fechaCreacion = new Date(data["fechaCreacion"])
        this.lang = data["lang"]
        this.mostrarBotonTraducir =
          this.lang !== this.translateService.currentLang
        this.obtenerNombreUsuario(this.idUsuario)
      },
      error: (err) => {
        console.error("Error al obtener la entrada:", err)
      },
    })
  }

  private obtenerNombreUsuario(idUsuario: string) {
    this.usuarioService.getUsuario(idUsuario).subscribe({
      next: (usuario) => {
        this.nombreUsuario = usuario.name
      },
      error: (err) => {
        console.error("Error al obtener el usuario:", err)
        this.nombreUsuario = this.translateService.instant("DESCONOCIDO")
      },
    })
  }

  private cargarMapa() {
    this.mapasService.getMapaByEntradaId(this.entradaId).subscribe({
      next: (mapa) => {
        if (mapa && mapa.lat && mapa.lon) {
          this.tieneMapa = true
          this.entradaForm.get("ubicacion")?.patchValue({
            lat: mapa.lat,
            lon: mapa.lon,
          })
        }
      },
      error: (err) => {
        console.error("Error al obtener el mapa:", err)
      },
    })
  }
}
