import { AuthConfig } from "angular-oauth2-oidc"
import { environment } from "@env/environment"

export const authConfig: AuthConfig = {
  issuer: "https://accounts.google.com",
  strictDiscoveryDocumentValidation: false,
  showDebugInformation: true,
  clientId: environment.CLIENT_ID,
  redirectUri: window.location.origin + "/bridge",
  // redirectUri: "https://frontend-examen.vercel.app/dashboard",
  scope: "openid profile email",
}
