import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { UserService } from "@app/core/services/user.service"
import { catchError, Observable, throwError } from "rxjs"
import { environment as env } from "@env/environment"

@Injectable({
  providedIn: "root",
})
export class NewEntradaService {
  private apiUrl = `${env.BACKEND_URL}/entradas/`

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  // Método para crear una entrada
  createEntrada(entradaData: any): Observable<any> {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }
    return this.http.post(this.apiUrl, entradaData, { headers }).pipe(
      catchError((error) => {
        console.error("Error en la creación de la entrada", error)
        return throwError(error)
      }),
    )
  }
}
