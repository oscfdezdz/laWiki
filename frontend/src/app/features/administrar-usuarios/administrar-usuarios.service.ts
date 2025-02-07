import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { UserService } from "@app/core/services/user.service"
import { environment as env } from "@env/environment"
import { map } from "rxjs/operators"

@Injectable({
  providedIn: "root",
})
export class AdministrarUsuariosService {
  private apiUrl = `${env.BACKEND_URL}/`

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  getUsuarios() {
    return this.http
      .get<{
        users: any[]
      }>(`${this.apiUrl}usuarios`)
      .pipe(map((response) => response.users))
  }

  cambiarRol(id: string, rol: string) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }

    return this.http.put(
      `${this.apiUrl}usuarios/${id}`,
      {
        role: rol,
      },
      { headers },
    )
  }

  borrarUsuario(id: string) {
    const headers = {
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }

    return this.http.delete(`${this.apiUrl}usuarios/${id}`, { headers })
  }
}
