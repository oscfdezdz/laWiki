import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { WikisComponent } from "@features/wikis/wikis.component"
import { NewWikiComponent } from "@features/new-wiki/new-wiki.component"
import { EntradasComponent } from "@features/entradas/entradas.component"
import { NewEntradaComponent } from "@features/new-entrada/new-entrada.component"
import { EntradaComponent } from "@features/entrada/entrada.component"
import { EditorWikiComponent } from "@features/editar-wiki/editar-wiki.component"
import { EditorEntradasComponent } from "@features/editor-entradas/editor-entradas.component"
import { HistorialVersionesComponent } from "@features/historial-versiones/historial-versiones.component"
import { PerfilComponent } from "@features/perfil/perfil.component"
import { UsuarioComponent } from "@features/usuario/usuario.component"
import { LoginComponent } from "@features/login/login.component"
import { BridgeComponent } from "@features/bridge/bridge.component"
import { AdministrarUsuariosComponent } from "./features/administrar-usuarios/administrar-usuarios.component"

export const routes: Routes = [
  { path: "", component: WikisComponent },
  { path: "login", component: LoginComponent },
  { path: "bridge", component: BridgeComponent },
  { path: "new_wiki", component: NewWikiComponent },
  { path: "wiki/:id", component: EntradasComponent },
  { path: "wiki/:idWiki/new_entrada", component: NewEntradaComponent },
  { path: "wiki/:idWiki/editar", component: EditorWikiComponent },
  { path: "entrada/:id", component: EntradaComponent },
  { path: "entrada/:id/editar", component: EditorEntradasComponent },
  { path: "entrada/:id/historial", component: HistorialVersionesComponent },
  { path: "perfil/:id", component: PerfilComponent },
  { path: "usuario/:id", component: UsuarioComponent },
  { path: "administrar_usuarios", component: AdministrarUsuariosComponent },
  { path: "**", redirectTo: "" },
  // otras rutas
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
