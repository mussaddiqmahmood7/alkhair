import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/admin/login-form"

export default async function AdminLoginPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")

  if (token) {
    redirect("/admin/dashboard")
  }

  return <LoginForm />
}
