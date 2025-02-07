import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { UserService } from "@app/core/services/user.service"
import { catchError, Observable, throwError } from "rxjs"
import { environment as env } from "@env/environment"

@Injectable({
  providedIn: "root",
})
export class NewVersionService {
  private apiUrl = `${env.BACKEND_URL}/versiones/`

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  // Método para crear una versión
  createVersion(versionData: any): Observable<any> {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }
    return this.http.post(this.apiUrl, versionData, { headers }).pipe(
      catchError((error) => {
        console.error("Error al crear la versión", error)
        return throwError(() => error)
      }),
    )
  }

  // Método para actualizar una versión
  updateVersion(id: string, versionData: any): Observable<any> {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }
    return this.http.put(`${this.apiUrl}${id}`, versionData, { headers }).pipe(
      catchError((error) => {
        console.error("Error al actualizar la versión", error)
        return throwError(() => error)
      }),
    )
  }
}
