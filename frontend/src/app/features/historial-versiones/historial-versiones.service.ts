import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { UserService } from "@app/core/services/user.service"
import { map } from "rxjs/operators"
import { environment as env } from "@env/environment"

@Injectable({
  providedIn: "root",
})
export class HistorialVersionesService {
  private apiUrl = `${env.BACKEND_URL}/`

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  getVersionesByEntradaId(entradaId: string) {
    return this.http
      .get<{
        versiones: any[]
      }>(`${this.apiUrl}versiones?idEntrada=${entradaId}`)
      .pipe(map((response) => response.versiones))
  }

  getEntradaById(entradaId: string) {
    return this.http.get(`${this.apiUrl}entradas/${entradaId}`)
  }

  getUsuarioById(usuarioId: string) {
    return this.http.get(`${this.apiUrl}usuarios/${usuarioId}`)
  }

  // Método para actualizar la fecha de edición
  updateFechaEdicion(idVersion: string, nuevaFecha: string) {
    const headers = {
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }

    return this.http.put(
      `${this.apiUrl}versiones/${idVersion}`,
      {
        fechaEdicion: nuevaFecha,
      },
      { headers },
    )
  }
}
