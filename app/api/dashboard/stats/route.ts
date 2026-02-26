import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    data: [
      { id: "users", label: "Active Users", value: "1,284", trend: "+8.2% this week" },
      { id: "sessions", label: "Sessions", value: "9,340", trend: "+4.6% this week" },
      { id: "conversion", label: "Conversion Rate", value: "6.7%", trend: "+1.1% this week" },
      { id: "revenue", label: "Revenue", value: "$48,200", trend: "+12.4% this week" },
    ],
  });
}
