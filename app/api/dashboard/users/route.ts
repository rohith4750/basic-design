import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { pg } from "@/lib/postgres";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
};

const seedUsers: UserRow[] = [
  {
    id: "u-101",
    name: "Aarav Patel",
    email: "aarav@starter.com",
    role: "Frontend Engineer",
    status: "Active",
    lastLogin: "2026-02-26 10:12",
  },
  {
    id: "u-102",
    name: "Meera Iyer",
    email: "meera@starter.com",
    role: "UI Designer",
    status: "Active",
    lastLogin: "2026-02-26 09:01",
  },
  {
    id: "u-103",
    name: "Kabir Khan",
    email: "kabir@starter.com",
    role: "QA Engineer",
    status: "Pending",
    lastLogin: "2026-02-24 17:40",
  },
  {
    id: "u-104",
    name: "Isha Verma",
    email: "isha@starter.com",
    role: "Backend Engineer",
    status: "Inactive",
    lastLogin: "2026-02-18 12:22",
  },
  {
    id: "u-105",
    name: "Neel Sharma",
    email: "neel@starter.com",
    role: "Product Manager",
    status: "Active",
    lastLogin: "2026-02-26 08:32",
  },
  {
    id: "u-106",
    name: "Anaya Singh",
    email: "anaya@starter.com",
    role: "DevOps Engineer",
    status: "Pending",
    lastLogin: "2026-02-25 20:15",
  },
];

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await pg.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      status TEXT NOT NULL,
      last_login TEXT NOT NULL
    )
  `);

  const countResult = await pg.query<{ count: string }>("SELECT COUNT(*)::text AS count FROM users");
  const count = Number(countResult.rows[0]?.count ?? "0");

  if (count === 0) {
    const values: string[] = [];
    const params: string[] = [];

    seedUsers.forEach((user, index) => {
      const i = index * 6;
      values.push(`($${i + 1}, $${i + 2}, $${i + 3}, $${i + 4}, $${i + 5}, $${i + 6})`);
      params.push(user.id, user.name, user.email, user.role, user.status, user.lastLogin);
    });

    await pg.query(
      `INSERT INTO users (id, name, email, role, status, last_login) VALUES ${values.join(", ")}`,
      params,
    );
  }

  const usersResult = await pg.query<UserRow>(`
    SELECT id, name, email, role, status, last_login AS "lastLogin"
    FROM users
    ORDER BY name ASC
  `);

  return NextResponse.json({
    data: usersResult.rows,
  });
}
