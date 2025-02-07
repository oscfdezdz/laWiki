import { Injectable } from "@angular/core"

@Injectable({
  providedIn: "root",
})
export class SubirImagenesService {
  private url = ""

  setUrl(url: string) {
    this.url = url
  }

  getUrl(): string {
    return this.url
  }
}
