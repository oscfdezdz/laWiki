import { Component } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { ComentariosService } from "./comentarios.service"
import { CommonModule, DatePipe } from "@angular/common"
import { catchError, map, Observable, of } from "rxjs"
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import { TranslatePipe, TranslateService } from "@ngx-translate/core"
import { UserService } from "@core/services/user.service"

@Component({
  selector: "app-comentarios",
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: "./comentarios.component.html",
  providers: [DatePipe],
})
export class ComentariosComponent {
  comentarioForm: FormGroup
  entradaId!: string
  comentarios: any[] = []

  constructor(
    private route: ActivatedRoute,
    private comentariosService: ComentariosService,
    private userService: UserService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private translateService: TranslateService,
  ) {
    this.comentarioForm = this.fb.group({
      contenido: ["", Validators.required],
    })
  }

  ngOnInit(): void {
    this.entradaId = this.route.snapshot.paramMap.get("id")!
    this.comentariosService.getComentarios(this.entradaId).subscribe({
      next: (data) => {
        this.comentarios = data
        this.getUsuarios(data)
        console.log("Comentarios:", this.comentarios)
      },
      error: (err) => {
        console.error("Error al obtener los comentarios:", err)
      },
    })
  }

  getUsuarios(data: any[]): void {
    console.log("getUsuarios")
    for (const comentario of data) {
      console.log(comentario + " " + comentario["idUsuario"])
      this.comentariosService
        .getUsuarioById(comentario["idUsuario"])
        .subscribe({
          next: (data: any) => {
            console.log(data)
            comentario["nombreUsuario"] = data["name"]
          },
          error: (err: any) => {
            console.error("Error al obtener el usuario:", err)
            comentario["nombreUsuario"] =
              this.translateService.instant("CUENTA_ELIMINADA")
          },
        })
    }
  }

  getNameById(id: string): Observable<string> {
    return this.comentariosService.getUsuarioById(id).pipe(
      map((data: any) => data["name"]),
      catchError((err: any) => {
        console.error("Error al obtener el usuario:", err)
        return of("") // Devuelve un Observable con un string vacío en caso de error
      }),
    )
  }
  crearComentario(): void {
    if (this.comentarioForm.valid) {
      const comentarioData = this.comentarioForm.value
      comentarioData.idEntrada = this.entradaId
      comentarioData.idUsuario = this.userService.getUser()?.id

      this.comentariosService.crearComentario(comentarioData).subscribe({
        next: (response) => {
          // put the new comment at the top of the list
          this.getNameById(response["idUsuario"]).subscribe({
            next: (data) => {
              response.nombreUsuario = data
              this.comentarios.unshift(response)
              this.comentarioForm.reset()
            },
            error: (err) => {
              console.error("Error al obtener el nombre de usuario:", err)
            },
          })
        },
        error: (err) => {
          console.error("Error al crear el comentario:", err)
        },
      })
    }
  }

  formatearFecha(fecha: string): string {
    return this.datePipe.transform(fecha, "dd/MM/yyyy HH:mm") || ""
  }
}
