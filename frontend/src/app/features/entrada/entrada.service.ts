import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment as env } from "@env/environment"

@Injectable({
  providedIn: "root",
})
export class EntradaService {
  private apiUrl = `${env.BACKEND_URL}/entradas/`

  constructor(private http: HttpClient) {}

  getEntradaById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}`)
  }
}
