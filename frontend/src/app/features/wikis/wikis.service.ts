import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { UserService } from "@app/core/services/user.service"
import { environment as env } from "@env/environment"

@Injectable({
  providedIn: "root",
})
export class WikisService {
  private apiUrl = `${env.BACKEND_URL}/wikis/`

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  getWikis(nombre?: string): Observable<any[]> {
    let url = this.apiUrl

    if (nombre) {
      url = `${this.apiUrl}?nombre=${nombre}`
    }

    return this.http
      .get<{ wikis: any[] }>(url)
      .pipe(map((response) => response.wikis))
  }

  // Método para obtener una wiki por su id
  getWiki(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}`)
  }

  //Metodo  para editar una wiki
  editWiki(id: string, data: any): Observable<any> {
    const headers = {
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }
    return this.http.put(`${this.apiUrl}${id}`, data, { headers })
  }

  // Método para eliminar una wiki
  deleteWiki(id: string): Observable<any> {
    const headers = {
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }
    return this.http.delete(`${this.apiUrl}${id}`, { headers })
  }
}
