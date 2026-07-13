import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import AdminConsole from "@/components/admin/AdminConsole";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <AdminConsole user={user} />;
}
