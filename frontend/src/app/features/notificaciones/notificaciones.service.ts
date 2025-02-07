import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { UserService } from "@core/services/user.service"
import { environment as env } from "@env/environment"

@Injectable({
  providedIn: "root",
})
export class NotificacionesService {
  private apiURL = `${env.BACKEND_URL}/notificaciones`

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  getNotificaciones(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}`)
  }

  deleteNotificacion(id: string): Observable<any> {
    const headers = {
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }
    return this.http.delete(`${this.apiURL}/${id}`, { headers })
  }

  deleteAllNotificaciones(): Observable<any> {
    const headers = {
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }
    return this.http.delete(`${this.apiURL}`, { headers })
  }

  markAsRead(id: string): Observable<any> {
    const body = { is_read: true }
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }
    return this.http.put(`${this.apiURL}/${id}`, body, { headers })
  }

  markAsUnread(id: string): Observable<any> {
    const body = { is_read: false }
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }
    return this.http.put(`${this.apiURL}/${id}`, body, { headers })
  }
}
