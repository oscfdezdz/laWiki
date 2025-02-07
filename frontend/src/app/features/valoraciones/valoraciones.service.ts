import { HttpClient, HttpParams } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { UserService } from "@app/core/services/user.service"
import { map, Observable } from "rxjs"
import { environment as env } from "@env/environment"

@Injectable({
  providedIn: "root",
})
export class ValoracionesService {
  private apiUrl = `${env.BACKEND_URL}/valoraciones/`

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  getValoraciones(params: { [key: string]: any }): Observable<any[]> {
    const httpParams = new HttpParams({ fromObject: params })
    return this.http
      .get<any>(this.apiUrl, { params: httpParams })
      .pipe(map((response) => response.valoraciones || []))
  }

  createValoracion(data: any): Observable<any> {
    const headers = {
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }
    return this.http.post<any>(`${this.apiUrl}`, data, { headers })
  }

  updateValoracion(id: string, nota: number): Observable<any> {
    const headers = {
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }
    return this.http.put<any>(`${this.apiUrl}${id}`, { nota }, { headers })
  }
}
