import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { UserService } from "@app/core/services/user.service"
import { Observable } from "rxjs"
import { environment as env } from "@env/environment"

@Injectable({
  providedIn: "root",
})
export class SubirImagenesService {
  private apiUrl = `${env.BACKEND_URL}/archivos/subir`

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  subirImagen(file: File): Observable<any> {
    const body = new FormData()
    const headers = {
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }
    body.append("archivo", file)
    return this.http.post(this.apiUrl, body, { headers })
  }
}
