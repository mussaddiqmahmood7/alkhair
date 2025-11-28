import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/dashboard"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")

  if (!token) {
    redirect("/admin")
  }

  return <AdminDashboard />
}
