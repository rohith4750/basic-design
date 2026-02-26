import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginRoutes, menuData } from "@/constants/menu";

export default async function RootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token");
  redirect(token ? menuData[0].route : loginRoutes[0]);
}
