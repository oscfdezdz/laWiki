import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { catchError, Observable, throwError } from "rxjs"
import { UserService } from "@app/core/services/user.service"
import { environment as env } from "@env/environment"

@Injectable({
  providedIn: "root",
})
export class MapasService {
  private apiUrl = `${env.BACKEND_URL}/mapas/`

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  searchByQuery(params: {
    query?: string
    lat?: number
    lon?: number
  }): Observable<any> {
    let url = this.apiUrl

    if (params.query) {
      url += `?q=${encodeURIComponent(params.query)}`
    } else if (params.lat !== undefined && params.lon !== undefined) {
      url += `?lat=${params.lat}&lon=${params.lon}`
    } else {
      throw new Error("Debe proporcionar una 'query' o 'lat' y 'lon'")
    }

    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error("Error al buscar ubicación:", error)
        return throwError(() => error)
      }),
    )
  }

  createMapa(mapaData: any): Observable<any> {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }
    return this.http.post(this.apiUrl, mapaData, { headers }).pipe(
      catchError((error) => {
        console.error("Error al crear el mapa", error)
        return throwError(() => error)
      }),
    )
  }

  updateMapa(id: string, mapaData: any): Observable<any> {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }
    return this.http.put(`${this.apiUrl}${id}`, mapaData, { headers }).pipe(
      catchError((error) => {
        console.error("Error al actualizar el mapa", error)
        return throwError(() => error)
      }),
    )
  }

  getMapaByEntradaId(entradaId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}entrada/${entradaId}`)
  }

  deleteMapa(id: string): Observable<any> {
    const headers = {
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }
    return this.http.delete(`${this.apiUrl}${id}`, { headers }).pipe(
      catchError((error) => {
        console.error("Error al eliminar el mapa", error)
        return throwError(() => error)
      }),
    )
  }
}
