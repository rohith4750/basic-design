import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    data: {
      name: "Rohit Sharma",
      email: "admin@starter.com",
      role: "Frontend Developer",
      department: "Product Engineering",
      location: "Bengaluru, IN",
    },
  });
}
