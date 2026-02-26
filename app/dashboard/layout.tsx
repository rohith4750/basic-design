import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell/app-shell";
import { loginRoutes } from "@/constants/menu";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token");

  if (!token) {
    redirect(loginRoutes[0].route);
  }

  return <AppShell>{children}</AppShell>;
}
