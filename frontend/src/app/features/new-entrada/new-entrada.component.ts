import { Component, ViewChild } from "@angular/core"
import { CommonModule } from "@angular/common"
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms"
import { ActivatedRoute, RouterModule } from "@angular/router"
import { NewEntradaService } from "./new-entrada.service"
import { NewVersionComponent } from "../new-version/new-version.component"
import { MapasComponent } from "../mapas/mapas.component"
import { BotonAtrasComponent } from "@shared/components/boton-atras/boton-atras.component"
import { TranslatePipe, TranslateService } from "@ngx-translate/core"
import { UserService } from "@app/core/services/user.service"

@Component({
  selector: "app-new-entrada",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NewVersionComponent,
    MapasComponent,
    BotonAtrasComponent,
    TranslatePipe,
    RouterModule,
  ],
  templateUrl: "./new-entrada.component.html",
})
export class NewEntradaComponent {
  entradaForm: FormGroup
  idWiki: string | null = null
  idVersion: string | null = null
  mostrarMapa = false

  @ViewChild(NewVersionComponent) newVersionComponent!: NewVersionComponent
  @ViewChild(MapasComponent, { static: false }) mapasComponent!: MapasComponent
  @ViewChild(BotonAtrasComponent) botonAtrasComponent!: BotonAtrasComponent

  constructor(
    private newEntradaService: NewEntradaService,
    private userSerive: UserService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private translateService: TranslateService,
  ) {
    this.entradaForm = this.fb.group({
      nombre: ["", Validators.required],
      nombreUsuario: ["", Validators.required], // TO-DO
      idUsuario: ["", Validators.required], // TO-DO
      idWiki: ["", Validators.required],
      lang: [""],
      version: this.fb.group({
        contenido: ["", Validators.required],
      }),
      mapa: this.fb.group({
        ubicacion: this.fb.group({
          lat: [""],
          lon: [""],
        }),
      }),
    })
  }

  ngOnInit(): void {
    this.entradaForm.patchValue({
      idUsuario: this.userSerive.getUser()?.id,
      nombreUsuario: this.userSerive.getUser()?.name,
    })
    this.idWiki = this.route.snapshot.paramMap.get("idWiki")
    if (this.idWiki) {
      console.log("idWiki recibido:", this.idWiki)
      this.entradaForm.patchValue({ idWiki: this.idWiki })
    } else {
      console.error("idWiki no proporcionado")
    }

    const lang = this.translateService.currentLang || "es"
    this.entradaForm.patchValue({ lang })

    this.route.queryParams.subscribe((params) => {
      if (params["nombreEntrada"] && params["contenidoVersion"]) {
        this.entradaForm.patchValue({
          nombre: params["nombreEntrada"],
          version: { contenido: params["contenidoVersion"] },
        })
      }
      if (params["lat"] && params["lon"]) {
        this.entradaForm.patchValue({
          mapa: { ubicacion: { lat: params["lat"], lon: params["lon"] } },
        })
        this.mostrarMapa = true
      }
    })
  }

  toggleMapa(): void {
    this.mostrarMapa = !this.mostrarMapa

    if (this.mostrarMapa) {
      this.entradaForm.get("mapa")?.enable()
    } else {
      this.entradaForm.get("mapa")?.disable()
    }
  }

  crearEntrada() {
    if (this.entradaForm.valid) {
      const entradaData = this.entradaForm.value

      this.newVersionComponent.crearVersion()

      this.newVersionComponent.versionCreated.subscribe((idVersion: string) => {
        this.idVersion = idVersion

        entradaData.idVersionActual = this.idVersion

        this.newEntradaService.createEntrada(entradaData).subscribe({
          next: (response) => {
            console.log("Entrada creada correctamente:", response)

            const idEntrada = response.idEntrada
            if (idEntrada) {
              this.newVersionComponent.actualizarVersion(
                this.idVersion!,
                entradaData.idUsuario,
                idEntrada,
                entradaData.version.contenido,
              )
            }

            const ubicacion = this.entradaForm.get("mapa.ubicacion")?.value
            if (ubicacion && this.mapasComponent) {
              this.mapasComponent.crearMapa()

              this.mapasComponent.mapaCreated.subscribe((idMapa: string) => {
                console.log("Mapa creado correctamente:", idMapa)

                this.mapasComponent.actualizarMapa(idMapa, idEntrada)
              })
            }

            this.botonAtrasComponent.ruta = `/wiki/${this.idWiki}`
            this.botonAtrasComponent.volverAtras()
          },
          error: (err) => {
            console.error("Error al crear la entrada:", err)
          },
        })
      })
    } else {
      console.log("Formulario no válido")
    }
  }
}
