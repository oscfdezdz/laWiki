import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { UserService } from "@app/core/services/user.service"
import { Observable } from "rxjs"
import { environment as env } from "@env/environment"

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  private apiUrl = `${env.BACKEND_URL}/usuarios/`

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  // Método para obtener un usuario por su id
  getUsuario(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}`)
  }

  //Metodo para editar un usuario
  editUsuario(id: string, data: any): Observable<any> {
    const headers = {
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }
    return this.http.put(`${this.apiUrl}${id}`, data, { headers })
  }

  // Método para eliminar un usuario
  deleteUsuario(id: string): Observable<any> {
    const headers = {
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }
    return this.http.delete(`${this.apiUrl}${id}`, { headers })
  }
}
