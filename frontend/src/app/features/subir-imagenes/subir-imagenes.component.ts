import { Component } from "@angular/core"
import { HttpClientModule } from "@angular/common/http"
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { SubirImagenesService } from "./subir-imagenes.service"
import { TranslatePipe } from "@ngx-translate/core"
import { UserService } from "@app/core/services/user.service"
import { environment as env } from "@env/environment"

@Component({
  selector: "app-subir-imagenes",
  imports: [HttpClientModule, CommonModule, FormsModule, TranslatePipe],
  templateUrl: "./subir-imagenes.component.html",
  styleUrls: ["./subir-imagenes.component.scss"],
})
export class SubirImagenesComponent {
  public url = ""
  selectedFile: File | null = null
  mensaje = ""

  constructor(
    private imageUrl: SubirImagenesService,
    private userService: UserService,
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]
    }
  }

  async onSubmit(): Promise<void> {
    if (this.selectedFile) {
      const formData = new FormData()
      formData.append("archivo", this.selectedFile)
      const headers = {
        Authorization: `Bearer ${this.userService.getUser()?.oauth.access_token}`,
      }

      try {
        const response = await fetch(`${env.BACKEND_URL}/archivos/subir`, {
          method: "POST",
          body: formData,
          headers,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.mensaje || "Error al subir la imagen")
        }

        const data = await response.json()
        console.log(data["url"])
        this.mensaje = data.mensaje
        this.imageUrl.setUrl(data["url"])
      } catch (error) {
        if (error instanceof Error) {
          this.mensaje = error.message
        } else {
          this.mensaje = "Error desconocido al subir la imagen"
        }
      }
    }
  }
}
