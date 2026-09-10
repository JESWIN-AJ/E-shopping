export interface User {
  _id: string
  firstname: string
  lastname: string
  email: string
  phone?: string
}

export interface AuthResponse {
  status: boolean
  token?: string
  user?: User
  error?: string
}