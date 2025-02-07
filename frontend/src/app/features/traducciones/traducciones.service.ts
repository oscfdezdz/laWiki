import { Injectable } from "@angular/core"
import { TranslateService } from "@ngx-translate/core"
import { HttpClient } from "@angular/common/http"
import { firstValueFrom } from "rxjs"
import { UserService } from "@app/core/services/user.service"
import { environment as env } from "@env/environment"

@Injectable({
  providedIn: "root",
})
export class TraduccionesService {
  private apiUrl = `${env.BACKEND_URL}/traducciones`
  private cache: { [key: string]: any } = {}

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private userService: UserService,
  ) {}

  async traducirYActualizar(lang: string): Promise<void> {
    const defaultTexts = await firstValueFrom(this.http.get("/i18n/es.json"))

    if (this.cache[lang] || lang === "es") {
      this.translate.setTranslation(
        lang,
        lang === "es" ? defaultTexts : this.cache[lang],
        true,
      )
      this.translate.use(lang)
      return
    }

    const traducciones = await this.traducirTexto(defaultTexts, lang)

    this.cache[lang] = traducciones
    localStorage.setItem(`translations_${lang}`, JSON.stringify(traducciones))

    this.translate.setTranslation(lang, traducciones, true)
    this.translate.use(lang)
  }

  private async traducirTexto(
    defaultTexts: any,
    targetLang: string,
  ): Promise<any> {
    const body = {
      textos: defaultTexts,
      target_lang: targetLang,
    }

    const headers = {
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
    }
    const response = await firstValueFrom(
      this.http.post<any>(`${this.apiUrl}/traducir`, body, { headers }),
    )

    return response.translations
  }

  async traducirTextoDirecto(texto: string): Promise<string> {
    const lang = this.translate.currentLang || "es"

    if (lang === "es") {
      return texto
    }

    if (this.cache[lang]?.[texto]) {
      return this.cache[lang][texto]
    }

    const localCache = localStorage.getItem(`translations_${lang}`)
    if (localCache) {
      const parsedCache = JSON.parse(localCache)
      if (parsedCache[texto]) {
        this.cache[lang] = parsedCache
        return parsedCache[texto]
      }
    }

    const body = {
      textos: { [texto]: texto },
      target_lang: lang,
    }

    const headers = {
      Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
      "Content-Type": "application/json",
    }

    try {
      const response = await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}/traducir`, body, { headers }),
      )

      const traduccion = response.translations[texto]

      if (!this.cache[lang]) {
        this.cache[lang] = {}
      }
      this.cache[lang][texto] = traduccion

      const updatedCache = { ...this.cache[lang], ...{ [texto]: traduccion } }
      localStorage.setItem(`translations_${lang}`, JSON.stringify(updatedCache))

      return traduccion
    } catch (error) {
      console.error("Error al traducir el texto:", error)
      return texto
    }
  }

  cargarDesdeCache(lang: string): void {
    const cache = localStorage.getItem(`translations_${lang}`)
    if (cache) {
      this.cache[lang] = JSON.parse(cache)
      this.translate.setTranslation(lang, this.cache[lang], true)
    }
  }

  async obtenerIdiomasDisponibles(): Promise<any[]> {
    const response = await firstValueFrom(
      this.http.get<any>(`${this.apiUrl}/idiomas`),
    )

    return response.languages.map((lang: any) => ({
      code: lang.language,
      name: lang.name,
    }))
  }
}
