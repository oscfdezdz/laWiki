import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { UserService } from "@app/core/services/user.service"
import { environment as env } from "@env/environment"

@Injectable({
  providedIn: "root",
})
export class EntradasService {
  private apiUrl = `${env.BACKEND_URL}/entradas/`

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  getEntradas(wikiId: string): Observable<any[]> {
    return this.http
      .get<{ entradas: any[] }>(this.apiUrl + "?idWiki=" + wikiId)
      .pipe(map((response) => response.entradas))
  }

  getWikiName(wikiId: string): Observable<any> {
    return this.http.get(`${env.BACKEND_URL}/wikis/` + wikiId)
  }

  deleteEntrada(id: string): Observable<any> {
    const headers = {
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }
    return this.http.delete(`${this.apiUrl}${id}`, { headers })
  }
}
