import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { defaultDashboardRoute, loginRoutes } from "@/constants/menu";

export default async function RootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token");
  redirect(token ? defaultDashboardRoute : loginRoutes[0].route);
}
