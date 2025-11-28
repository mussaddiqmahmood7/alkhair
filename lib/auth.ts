const ADMIN_EMAIL = "mubashir"
const ADMIN_PASSWORD = "03009884810"

export function validateCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD
}

export function generateToken(): string {
  return Buffer.from(`${Date.now()}-${Math.random().toString(36)}`).toString("base64")
}

export const ADMIN_CREDENTIALS = {
  email: ADMIN_EMAIL,
  hint: "Password: 03009884810",
}
