import { NextResponse } from "next/server";

const DEMO_EMAIL = "admin@starter.com";
const DEMO_PASSWORD = "Admin@123";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = body?.email?.trim();
  const password = body?.password;

  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return NextResponse.json(
      { error: "Invalid credentials. Use the demo account from the login page." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    message: "Login successful",
    data: { name: "Rohit Sharma", email: DEMO_EMAIL, role: "Frontend Developer" },
  });

  response.cookies.set("session_token", crypto.randomUUID(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
