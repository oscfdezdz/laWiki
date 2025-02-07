type Role = "admin" | "lector" | "redactor" | "editor"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  profilePicture: string
  wantsEmailNotifications: boolean
  oauth: {
    access_token: string
    expires_in: number
    refresh_token?: string
    expires_in_refresh?: number
  }
}
