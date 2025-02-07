import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core"
import { provideHttpClient } from "@angular/common/http"
import { provideRouter } from "@angular/router"
import { provideTranslateService, TranslateLoader } from "@ngx-translate/core"
import { TranslateHttpLoader } from "@ngx-translate/http-loader"
import { HttpClient } from "@angular/common/http"

import { routes } from "./app.routes"
import { provideOAuthClient } from "angular-oauth2-oidc"

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (
  http: HttpClient,
) => new TranslateHttpLoader(http, "./i18n/", ".json")

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    provideOAuthClient(),
  ],
}
